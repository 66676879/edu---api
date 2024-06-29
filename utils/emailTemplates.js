exports.signupTemplate = (name, token) => `
  <p>Dear ${name},</p>
  <p>Thank you for signing up for the EDU Verse Desktop App! To complete your registration, please verify your email address using the following token:</p>
  <p><strong>Signup Token:</strong> ${token}</p>
  <p>Once verified, you will be able to fully access all the features of the app.</p>
  <p>If you did not sign up for this account, please ignore this email.</p>
  <p>Welcome to EDU Verse!</p>
  <p>Best regards,<br>The EDU Verse Team</p>
`;

exports.resetPasswordTemplate = (name, token) => `
  <p>Dear ${name},</p>
  <p>We received a request to reset your password for your EDU Verse Desktop App account. If you didn't request this change, please ignore this email.</p>
  <p>To reset your password, please use the following token:</p>
  <p><strong>Reset Token:</strong> ${token}</p>
  <p>This token will expire in 30 minutes. If you need a new token, you can request another reset from the app.</p>
  <p>Thank you for using EDU Verse!</p>
  <p>Best regards,<br>The EDU Verse Team</p>
`;
