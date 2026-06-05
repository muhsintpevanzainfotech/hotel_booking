const nodemailer = require('nodemailer');

const transportOptions = {
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
};

if (process.env.EMAIL_SERVICE) {
    transportOptions.service = process.env.EMAIL_SERVICE;
}

if (process.env.EMAIL_HOST) {
    transportOptions.host = process.env.EMAIL_HOST;
    transportOptions.port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587;
    transportOptions.secure = process.env.EMAIL_SECURE === 'true';
}

if (process.env.EMAIL_TLS_REJECT_UNAUTHORIZED === 'false') {
    transportOptions.tls = { rejectUnauthorized: false };
}

const transporter = nodemailer.createTransport(transportOptions);

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

exports.sendBookingStatusEmail = async (booking) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:6002';
    const checkLink = `${clientUrl}/booking-status?ref=${booking.bookingReference}`;
    
    let statusText = '';
    let statusColor = '#0F4C4C';
    let detailMessage = '';

    if (booking.status === 'Approved') {
        statusText = 'Approved & Confirmed';
        statusColor = '#14b8a6'; // Teal/emerald
        detailMessage = `We are delighted to inform you that your reservation has been approved. Your sanctuary at Lake Breeze Resorts is secured!`;
    } else if (booking.status === 'Rejected') {
        statusText = 'Rejected';
        statusColor = '#f43f5e'; // Rose
        detailMessage = `We regret to inform you that we are unable to accommodate your reservation request at this time. If you have any questions, please contact our concierge.`;
    } else if (booking.status === 'Cancelled') {
        statusText = 'Cancelled';
        statusColor = '#64748b'; // Slate
        detailMessage = `Your reservation has been successfully cancelled. We hope to welcome you to our resort in the future.`;
    } else {
        statusText = booking.status;
        detailMessage = `Your reservation status has been updated to: ${booking.status}.`;
    }

    const checkInDate = booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'N/A';
    const checkOutDate = booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'N/A';
    const roomName = booking.room?.name || 'Luxury Room';

    const mailOptions = {
        from: `"Lake Breeze Resorts" <${process.env.EMAIL_USER}>`,
        to: booking.email,
        subject: `Booking ${statusText} - Reference ID: ${booking.bookingReference}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 20px; background: #ffffff;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #0F4C4C; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 2px;">LAKE BREEZE RESORTS</h2>
                    <p style="color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; margin: 5px 0 0 0;">Kerala, India</p>
                </div>
                
                <div style="background: #f8fafc; border-left: 4px solid ${statusColor}; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <h3 style="color: ${statusColor}; margin-top: 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Reservation Status: ${statusText}</h3>
                    <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0;">Dear <strong>${booking.guestName}</strong>,</p>
                    <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 10px 0 0 0;">${detailMessage}</p>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 35px; font-size: 14px;">
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Booking Reference:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0F4C4C; font-family: monospace; font-size: 16px; font-weight: bold;">${booking.bookingReference}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Sanctuary:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #334155; font-weight: 600;">${roomName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Check-In Date:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #334155;">${checkInDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Check-Out Date:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #334155;">${checkOutDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Total Price:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0F4C4C; font-weight: bold; font-size: 16px;">₹${booking.totalPrice?.toLocaleString()}</td>
                    </tr>
                </table>
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <a href="${checkLink}" style="background-color: #0F4C4C; color: #ffffff; padding: 15px 35px; border-radius: 30px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; display: inline-block; box-shadow: 0 10px 20px rgba(15,76,76,0.2);">
                        View Reservation Details
                    </a>
                </div>
                
                <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center; font-size: 11px; color: #94a3b8;">
                    <p style="margin: 0 0 5px 0;">If you need further assistance, contact our concierge desk at +91 98765 43210.</p>
                    <p style="margin: 0; text-transform: uppercase; letter-spacing: 1px;">&copy; ${new Date().getFullYear()} Lake Breeze Resorts & Spa</p>
                </div>
            </div>
        `
    };

    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('--- BOOKING STATUS EMAIL SIMULATION ---');
            console.log(`To: ${booking.email}`);
            console.log(`Subject: ${mailOptions.subject}`);
            console.log(`Reference: ${booking.bookingReference}`);
            console.log(`Status: ${booking.status}`);
            console.log(`Link: ${checkLink}`);
            console.log('----------------------------------------');
            return true;
        }
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Booking status email failed:', error);
        return false;
    }
};

