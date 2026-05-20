const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendOTP = async (email, otp, type = 'verification') => {
    const subjects = {
        verification: 'Lake Breeze Resorts - Email Verification OTP',
        reset: 'Lake Breeze Resorts - Password Reset OTP',
        login: 'Lake Breeze Resorts - Login Verification OTP'
    };

    const messages = {
        verification: `Your email verification OTP is: ${otp}. It will expire in 10 minutes.`,
        reset: `Your password reset OTP is: ${otp}. It will expire in 10 minutes.`,
        login: `Your login verification OTP is: ${otp}. It will expire in 10 minutes.`
    };

    const mailOptions = {
        from: `"Lake Breeze Security" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subjects[type] || 'Lake Breeze Security Alert',
        text: messages[type] || `Your security OTP is: ${otp}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #14b8a6; text-align: center;">Lake Breeze Security</h2>
                <p>Hello,</p>
                <p>${messages[type]}</p>
                <div style="background: #f4f4f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #0f172a;">${otp}</span>
                </div>
                <p style="font-size: 12px; color: #64748b;">If you did not request this, please ignore this email or contact support if you believe your account is at risk.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="text-align: center; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px;">Lake Breeze Resorts & Spa</p>
            </div>
        `
    };

    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('--- EMAIL SIMULATION ---');
            console.log(`To: ${email}`);
            console.log(`Subject: ${subjects[type]}`);
            console.log(`OTP: ${otp}`);
            console.log('------------------------');
            return true;
        }
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

exports.sendStatusChangeEmail = async (email, status) => {
    const mailOptions = {
        from: `"Lake Breeze Security" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Account Status Update - ${status === 'Active' ? 'Activated' : 'Suspended'}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: ${status === 'Active' ? '#14b8a6' : '#f43f5e'}; text-align: center;">Account Security Update</h2>
                <p>Your account status has been updated to: <strong>${status}</strong>.</p>
                ${status === 'Suspended' 
                    ? '<p>Your access to the dashboard has been temporarily revoked. Please contact the administrator for more information.</p>'
                    : '<p>You can now log in to the dashboard using your credentials.</p>'}
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="text-align: center; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px;">Lake Breeze Resorts & Spa</p>
            </div>
        `
    };

    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log(`Simulation: Status Email sent to ${email} - Status: ${status}`);
            return true;
        }
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Status email failed:', error);
        return false;
    }
};

exports.sendWelcomeEmail = async (email, username, setupOTP) => {
    const mailOptions = {
        from: `"Lake Breeze Resorts" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to Lake Breeze Resorts Dashboard!',
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #14b8a6; text-align: center;">Welcome, ${username}!</h2>
                <p>Your official account for the Lake Breeze Resorts & Spa management dashboard has been initialized.</p>
                <p>To secure your account and set your permanent password, please use the initialization code below:</p>
                <div style="background: #f4f4f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #0f172a;">${setupOTP}</span>
                    <p style="margin-top: 10px; font-size: 11px; color: #64748b;">Visit the dashboard and select "First Time Login" or "Forgot Password" to set your password.</p>
                </div>
                <p style="font-size: 12px; color: #64748b;">This code will expire in 24 hours. For security reasons, please do not share this email with anyone.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="text-align: center; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px;">Lake Breeze Resorts & Spa</p>
            </div>
        `
    };

    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log(`Simulation: Welcome Email sent to ${email} for user ${username}`);
            return true;
        }
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Welcome email failed:', error);
        return false;
    }
};
