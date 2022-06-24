const fs = require("fs");
const path = require("path");
const rfs = require("rotating-file-stream");

const logDirectory = path.join(__dirname, "../production_logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
});

const development = {
  name: "development",
  asset_path: "/assets",
  session_cookie_key: process.env.DEV_SESSION_COOKIE_KEY,
  db: "codeial_development",
  smtp: {
    secure: false,
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.DEV_USERNAME,
      pass: process.env.DEV_PASS,
    },
  },
  google_client_id: process.env.DEV_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.DEV_GOOGLE_CLIENT_SECRET,
  google_call_back_url: process.env.DEV_GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.DEV_JWT_SECRET,
  morgan: {
    mode: "dev",
    options: { stream: accessLogStream },
  },
};

const production = {
  name: "production",
  asset_path: process.env.CODEIAL_ASSET_PATH,
  // aseet_path:'./assets',
  session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
  db: "codeial_production",
  smtp: {
    secure: false,
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.CODEIAL_GMAIL_USERNAME,
      // pass:'1234',
      pass: process.env.CODEIAL_GMAIL_PASSWORD,
    },
  },
  google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
  google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.CODEIAL_JWT_SECRET,
  morgan: {
    mode: "combined",
    options: { stream: accessLogStream },
  },
};

module.exports = 
eval(process.env.CODEIAL_ENVIRONMENT) == undefined
  ? development
  : eval(process.env.CODEIAL_ENVIRONMENT);
