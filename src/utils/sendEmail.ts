import Mailgun from 'mailgun-js';

const mailGunClient = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY || '',
  domain: 'sandbox2db053e6c51842f8884df5fd11d94342.mailgun.org',
});

const sendEmail = (subject: string, html: string) => {
  const emailData = {
    from: 'juyoung7018.park@gmail.com',
    to: 'juyoung7018.park@gmail.com',
    subject,
    html,
  };
  const result = mailGunClient.messages().send(emailData, (err, body) => {
    console.log(err);
    console.log(body);
  });
  return result;
};

export const sendVerificationEmail = (fullName: string, key: string) => {
  const emailSubject = `Hello! ${fullName}, please verify your email`;
  const emailBody = `Verify your emial by clicking <a href="http://puber.com/verification/${key}/">here</a>`;
  return sendEmail(emailSubject, emailBody);
};
