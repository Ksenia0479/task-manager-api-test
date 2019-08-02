const sgMail = require("@sendgrid/mail");

const SEND_API_KEY = process.env.SEND_API_KEY;

sgMail.setApiKey(SEND_API_KEY);

const from = "kc@bam-boo.eu";

const emailPattern = ({ to, subject, text }) => {
  sgMail.send({
    to,
    from,
    subject,
    text
  });
};

const sendWelcomeEmail = emailInfo => {
  emailInfo.subject = "Welcome to the Task Manager community!";
  emailInfo.text = `Welcome to the Task Manager App, ${
    emailInfo.receiverName
  }. Let me know how you get alone with the app`;

  emailPattern(emailInfo);
};

const sendCancellationEmail = emailInfo => {
  emailInfo.subject = `${emailInfo.receiverName}, your account has canceled`;
  emailInfo.text = `Hi, ${
    emailInfo.receiverName
  }. This email confirms your recent account cancellation`;

  emailPattern(emailInfo);
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
};
