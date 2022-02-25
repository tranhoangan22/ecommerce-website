const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

if (process.env.NODE_ENV !== "production") require("dotenv").config(); //  loads environment variables from the `.env` file into `process.env`, which allows `process.env` to access the secret key. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.

// https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a
const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  let accessToken = "";
  try {
    accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
    });
  } catch (err) {
    console.log(err);
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });

  return transporter;
};

let url;
if (process.env.NODE_ENV !== "production") {
  url = "http://localhost:3000";
} else {
  url = "https://antran-clothing.herokuapp.com";
}

// note: `transport.sendMail(..)` return a promise
module.exports.sendConfirmationEmail = async ({
  name,
  email,
  confirmationCode,
}) => {
  try {
    const transport = await createTransporter();
    await transport.sendMail({
      to: email,
      subject: "Please confirm your account with AnTran Clothing",
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for signing up with us! Please confirm your email by clicking on the following link.</p>
        <a href=${url}/confirm/${confirmationCode}> Click here</a>
        </div>`,
    });
  } catch (error) {
    console.log(`nodemailer failed to send email to ${email}!` + err);
  }
};

// note: `transport.sendMail(..)` return a promise
module.exports.sendcontactemailtouser = async ({ name, email }) => {
  try {
    const transport = await createTransporter();
    await transport.sendMail({
      to: email,
      subject: "We have received your message!",
      html: `<h1>Message Received!</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for getting in touch. We will contact you shortly about your message. </p>
        </div>`,
    });
  } catch (error) {
    console.log("error!! ", error);
  }
};
