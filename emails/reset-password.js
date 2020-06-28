module.exports = (url) => {
  return `
    <p>You are receiving this email because you (or someone else) has requested to reset the password of this account. Please visit the following link to complete the password reset process:</p>
    <p><a href="${url}">${url}</a></p>
    <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
    <p>If you have any questions, please reach out to contact@vuestarter.com (or reply to this email).</p>
  `;
};
