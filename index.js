const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const bodyParser = require("body-parser");
// used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT=require('./config/passport-jwt-strategy')
const MongoStore = require("connect-mongodb-session")(session);
const sassMiddleware=require('node-sass-middleware')
const flash=require('connect-flash')
const customeMware=require('./config/middleware')
// middlewares starting
app.use(sassMiddleware({
  src:'./assets/scss',
  dest:'./assets/css',
  debug:true,
  outputStyle:'expanded',
  prefix:'/css'
}))

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static("./assets"));
// make the uploads path available to the browser
app.use('/uploads',express.static(__dirname+'/uploads'))
app.use(expressLayouts);
// extract style and scripts from the sub pages in the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// middlewares ending

// setting up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// mongo store is used to store the session cookie in db
app.use(
  session({
    name: "codeial",
    // TODO change the secret before deployment in production
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: (1000 * 60 * 100),
    },
    store:new MongoStore(
      {
        uri:"mongodb://localhost:27017/codeial_development",
        // mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect to db ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenicatedUser);

app.use(flash())
app.use(customeMware.setFlash)
// use express router
app.use("/", require("./routes"));

app.listen(port, function (error) {
  if (error) {
    console.log(`error while running the server: ${error}`);
    return;
  }
  console.log(`server is running on port: ${port}`);
});
