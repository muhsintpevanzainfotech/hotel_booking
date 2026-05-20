const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTP, sendStatusChangeEmail, sendWelcomeEmail } = require('../utils/emailService');
const crypto = require('crypto');

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Allow login with either username or email
        const user = await User.findOne({ 
            $or: [{ username: username }, { email: username }] 
        }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }

        // Generate OTP for login
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        await user.save();

        await sendOTP(user.email, otp, 'login');

        res.json({
            message: 'Credentials verified. OTP sent to your email.',
            otpRequired: true,
            email: user.email // To help the frontend know where it was sent
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.verifyLoginOTP = async (req, res) => {
    try {
        const { username, otp } = req.body;
        // Search by username OR email since user might have typed either in step 1
        const user = await User.findOne({ 
            $or: [{ username: username }, { email: username }] 
        }).select('+otp');

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // OTP verified, generate token
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role, permissions: user.permissions },
            process.env.JWT_SECRET || 'hotel-management-jwt-secret',
            { expiresIn: '7d' }
        );

        user.lastLogin = Date.now();
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({
            message: 'Login successful',
            token,
            user: { 
                id: user._id,
                username: user.username, 
                role: user.role,
                permissions: user.permissions,
                notificationsEnabled: user.notificationsEnabled
            }
        });
    } catch (err) {
        console.error('OTP Verification error:', err);
        res.status(500).json({ message: 'Verification failed' });
    }
};

exports.register = async (req, res) => {
    try {
        const { username, email, password, role, permissions } = req.body;
        const currentUserRole = req.user.role;
        
        // 1. Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        // 2. Rule: Single Super Admin Only
        if (role === 'super_admin') {
            const superAdminExists = await User.findOne({ role: 'super_admin' });
            if (superAdminExists) {
                return res.status(400).json({ message: 'A Super Admin already exists. System only allows one Super Admin.' });
            }
            
            // 3. Rule: Only Super Admin can create another Super Admin (if one didn't exist, which is handled above)
            // But since we only allow one, an Admin can NEVER create a Super Admin.
            if (currentUserRole !== 'super_admin') {
                return res.status(403).json({ message: 'Admins are not authorized to create Super Admin accounts.' });
            }
        }

        const tempPassword = crypto.randomBytes(16).toString('hex');
        const newUser = new User({
            username,
            email,
            password: tempPassword,
            role: role || 'admin',
            permissions: permissions || [],
            isVerified: true
        });

        // Generate OTP for initial password setup
        const setupOTP = generateOTP();
        newUser.resetPasswordOTP = setupOTP;
        newUser.resetPasswordOTPExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours for first setup

        await newUser.save();
        await sendWelcomeEmail(email, username, setupOTP);

        res.status(201).json({ 
            message: 'User created. Initialization email sent.', 
            user: newUser
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Error creating user' });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email }).select('+otp');

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: 'Email verified successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Verification failed' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = generateOTP();
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendOTP(email, otp, 'reset');
        res.json({ message: 'Reset OTP sent to your email' });
    } catch (err) {
        res.status(500).json({ message: 'Error processing forgot password' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email }).select('+resetPasswordOTP');

        if (!user || user.resetPasswordOTP !== otp || user.resetPasswordOTPExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error resetting password' });
    }
};

exports.logout = (req, res) => {
    res.json({ message: 'Logout successful' });
};

exports.checkStatus = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(200).json({ isAuthenticated: false });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hotel-management-jwt-secret');
        const user = await User.findById(decoded.id).select('-password');
        if (!user || !user.isActive) return res.status(200).json({ isAuthenticated: false });
        
        res.json({ isAuthenticated: true, user });
    } catch (err) {
        res.status(200).json({ isAuthenticated: false });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        // Rule: Super Admin is hidden from all lists globally
        const query = { role: { $ne: 'super_admin' } };

        const users = await User.find(query).select('-password');
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = req.user;

        // Prevent deleting yourself
        if (id === currentUser.id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Rule: Admins cannot delete Super Admins
        if (targetUser.role === 'super_admin' && currentUser.role !== 'super_admin') {
            return res.status(403).json({ message: 'Admins cannot delete the Super Admin account' });
        }

        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, permissions, isActive } = req.body;
        const currentUser = req.user;

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Security Rules:
        // 1. Only Super Admin can modify other Super Admins (if any existed)
        // 2. Admins cannot modify Super Admins
        if (targetUser.role === 'super_admin' && currentUser.role !== 'super_admin') {
            return res.status(403).json({ message: 'Insufficient privileges to modify Super Admin' });
        }

        // 3. Prevent self-suspension
        if (id === currentUser.id && isActive === false) {
            return res.status(400).json({ message: 'Security protocol: Cannot suspend your own account' });
        }

        // 4. Admins cannot promote anyone to Super Admin
        if (role === 'super_admin' && currentUser.role !== 'super_admin') {
            return res.status(403).json({ message: 'Admins cannot assign Super Admin role' });
        }

        if (role) targetUser.role = role;
        if (permissions) targetUser.permissions = permissions;
        
        const oldStatus = targetUser.isActive;
        if (typeof isActive === 'boolean') targetUser.isActive = isActive;
        if (req.body.password) targetUser.password = req.body.password;

        await targetUser.save();

        // Send notification if status changed
        if (oldStatus !== targetUser.isActive) {
            await sendStatusChangeEmail(targetUser.email, targetUser.isActive ? 'Active' : 'Suspended');
        }

        res.json({ message: 'User updated successfully', user: targetUser });
    } catch (err) {
        console.error('Update User Error:', err);
        res.status(500).json({ message: 'Error updating user profile' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, email, notificationsEnabled } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (req.body.password) user.password = req.body.password;
        if (typeof notificationsEnabled === 'boolean') {
            user.notificationsEnabled = notificationsEnabled;
        }

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        console.error('Update Profile Error:', err);
        res.status(500).json({ message: 'Error updating profile' });
    }
};
