import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendActivationEmail = async (email: string, token: string, name: string) => {
  const activationUrl = `${process.env.NEXTAUTH_URL}/activate/${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Welcome to SmartSeason - Activate Your Account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #10b981;">Welcome to SmartSeason, ${name}!</h2>
        <p>You have been added as a Field Agent to our monitoring system.</p>
        <p>To access the platform, please click the button below to set your password and activate your account:</p>
        <a href="${activationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Activate Account</a>
        <p style="font-size: 0.875rem; color: #64748b;">This link will expire in 24 hours.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 0.75rem; color: #94a3b8;">If you cannot click the button, copy and paste this URL into your browser: <br /> ${activationUrl}</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.NEXTAUTH_URL}/activate/${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Reset Your SmartSeason Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #10b981;">Password Reset Requested</h2>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Reset Password</a>
        <p style="font-size: 0.875rem; color: #64748b;">This link will expire in 24 hours.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendFieldAssignmentEmail = async (email: string, fieldName: string, agentName: string) => {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: `Field Assignment: ${fieldName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #10b981;">New Field Assigned!</h2>
        <p>Hello ${agentName},</p>
        <p>You have been officially assigned as the lead agent for the following field:</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <strong style="color: #0f172a; font-size: 1.1rem;">${fieldName}</strong>
        </div>
        <p>Please check the dashboard to review the current stage and progress of this field.</p>
        <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">View My Fields</a>
        <p style="font-size: 0.875rem; color: #64748b;">If you have any questions, please contact the coordinator.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
