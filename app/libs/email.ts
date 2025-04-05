import nodemailer from 'nodemailer'

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
  // Cấu hình dịch vụ email (sử dụng dịch vụ SMTP của Gmail hoặc các dịch vụ khác)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Please verify your email address',
    html: `
      <h2>Welcome!</h2>
      <p>To complete your registration, please verify your email address.</p>
      <a href="${process.env.BASE_URL}/api/auth/verify?token=${verificationToken}">Click here to verify your email</a>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email')
  }
}
