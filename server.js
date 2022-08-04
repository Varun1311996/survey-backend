const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();
//force: true will drop the table if it already exists
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Database with { force: true }');
  initial();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to survey application." });
});

const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// These id's and secrets should come from .env file.
const CLIENT_ID = '534583247737-6ub132vqtel9lmks3s4ujus9u8vm1eot.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04_PNTpWphirbCgYIARAAGAQSNwF-L9Iro3ilrWaFJNPYfqDhoBxsix-irI0kwT570-jthn2jg7TTidaxt-NVR1D4o_kGStP3654'
//const REFRESH_TOKEN = '1//04cYvikMdg911CgYIARAAGAQSNwF-L9IrrlRO1LKBYonnZfY9s4vhPEL2FKY8mtdtF_G_2MeLrsdb71glDoR7loIytHmOBba3z9E';
//const REFRESH_TOKEN = '1//04z16PHBOsoAGCgYIARAAGAQSNwF-L9Irf0g-VBTK6JInprpacznk5dPB4bVuhFgogfNjjkRRFSc1pG4PzEvcQVvldcHIOLpeoRk';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

app.post("/mail", async (req, res) => {
  const email = req.body.email;
  const surveyLink = req.body.link;
  sendMail(email, surveyLink)
  .then((result) => console.log('Email sent...', result))
  .catch((error) => console.log(error.message));
res.send(`Email sent! ${email}`)
});
async function sendMail(email, surveyLink) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'Varun.k.project@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'Varun.k.project@gmail.com',
      to: email,
      subject: 'Hello from gmail using API2',
      text: 'Hello from gmail email using 2',
      html: surveyLink,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}
// routes
require('./app/routes/survey.routes')(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
// require('./app/routes/mail.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
module.exports = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "guest"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}