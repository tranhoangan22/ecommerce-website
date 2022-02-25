// ES5 syntax
const express = require("express");
const path = require("path"); // path is a native module
const enforce = require("express-sslify"); // used to enforces HTTPS connections on any incoming GET and HEAD requests
const compression = require("compression");
const firebase_api = require("./firebase.api");
const nodemailer_api = require("./nodemailer.api");
const cors = require("cors");

// for security reasons, STRIPE_SECRET_KEY must not be stored in our code base, it is stored in `.env`. Only works in development.
if (process.env.NODE_ENV !== "production") require("dotenv").config(); //  loads environment variables from the `.env` file into `process.env`, which allows `process.env` to access the secret key. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.

/* 
Bring in the Stripe object that we can use to make charges, for that we need access to the secret key. 
`process.env.STRIPE_SECRET_KEY` environment variable will contain the secret key when the app is deployed in production on Heroku (for that we will have to set it in heroku CLI). 
In development, `dotenv` is used to copy the secret key from `.env` file.
*/
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 4000; // if there is a value on `process.env.PORT`, we use that value, otherwise we use 5000. When you deploy to Heroku process.env.PORT is set up for us.

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Since express 4.16, we don't need `body-parser` as seperate package, since it is now available as a part of express. https://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4
app.use(express.json()); // parsing the body, use instead of `bodyParser` which has been deprecated

/* 
Serving static files in Express, in Production
*/
if (process.env.NODE_ENV === "production") {
  app.use(compression());

  app.use(
    enforce.HTTPS({
      trustProtoHeader: true,
    })
  );

  // if we're in production, we want to be able to serve all static files (which run on browswer side) in our /build folder. `/build` is what gets built when we run the build script in package.json
  app.use(express.static(path.join(__dirname, "client/build")));

  // if client hits any route, backend will send over the index.html in our build (which holds all of our frontend codes!)
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// We can make API call to backend from client side
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

/*
"Create" a server (that listens) on `port`
Tell the server to listen on a specific port for any `HTTP request` that gets sent to our server from a browser which is trying to get in touch with it. 
In order to see when our port is set up and when our server is running, we add a callback function to the listen method, which console.log something into THE CONSOLE.
*/
app.listen(port, (error) => {
  if (error) throw error;
  console.log("Server running on port " + port);
});

// Whenever an app tries to load a service worker, it will be looking for a service-worker.js file
app.get("/service-worker.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "build", "service-worker.js"));
});

/**
 * ANSWERING API REQUESTS
 */

// Handle the client's post request at /payment (that is made in frontend)
app.post("/payment", (req, res) => {
  console.log(req.body); // log the `req.body` that is sent in the post request that is made in frontend with axios
  // `req` is the post request containing the token received from frontend, `res` is the response we send back to the frontend
  // create a body object that we pass to Stripe using values that we get from the token
  const body = {
    source: req.body.token.id,
    amount: req.body.amount,
    currency: "usd",
  };

  /* 
  make an API request to Stripe to make the charge, note we want to inform our clientside app whether the payment is successful.
  docs on API to create a charge: https://stripe.com/docs/api/charges/create
  */
  stripe.charges.create(body, (stripeErr, stripeRes) => {
    if (stripeErr) {
      console.log(stripeErr);
      res.status(500).send({ error: stripeErr }); // 500: internal server error
    } else {
      res.status(200).send({ success: stripeRes });
    }
  });
});

// Create user document on Firestore and send back the userRef
app.post("/api/createuser", firebase_api.createUserDocument);

// Verify user when user attempts to sign in (w email or google), refreshes the page
app.post("/api/verifyuser", firebase_api.verifyUser);

// Update contact info database when someone submit the contact form
app.post("/api/updateusercontactinfo/", firebase_api.updateUserContactInfo);

app.post("/api/sendsignupemailtouser", async (req, res) => {
  try {
    await nodemailer_api.sendConfirmationEmail({
      name: req.body.params.name,
      email: req.body.params.email,
      confirmationCode: req.body.params.confirmationCode,
    });
    res
      .status(200)
      .send({ message: "successfully sent signup confirmation email to user" });
  } catch (err) {
    res.status(500).send({
      err,
      message: "error sending signup confirmation email to user",
    });
  }
});

app.post("/api/sendcontactemailtouser", async (req, res) => {
  try {
    await nodemailer_api.sendcontactemailtouser({
      name: req.body.params.name,
      email: req.body.params.email,
    });
    res.status(200).send({
      message: "successfully sent contact confirmation email to user",
    });
  } catch (err) {
    res.status(500).send({
      err,
      message: "error sending contact confirmation email to user",
    });
  }
});

// Activate user when they click on confirmation link
app.post("/api/activateuser", firebase_api.activateUser);

/*
Stripe Node.js library https://www.npmjs.com/package/stripe
The Stripe Node library provides convenient access to the Stripe API from applications written in server-side JavaScript.
*/

/*
Deploying to Heroku:
Deploy a React app (created with create-react-ap) with a Node server (express.js) on heroku: https://github.com/mars/heroku-cra-node 
*/

/* 
-------------------------------------------------
** Heroku Buildpack for create-react-app **

  PURPOSE: This buildpack deploys a React UI as a static web site. The Nginx web server provides optimum performance and security for the runtime.

  HOW:
    - Generate a React app: 
          `npx create-react-app@3.x $APP_NAME`
    - Create the Heroku app
          `heroku create $APP_NAME --buildpack mars/create-react-app`
              - sets the app name & its default URL https://$APP_NAME.herokuapp.com
              - sets the app to use this buildpack. More on builbacks https://devcenter.heroku.com/articles/buildpacks
              - configures the heroku git remote in the local repo, so git push heroku master will push to this new Heroku app.

          it will use the production build of our react app for the deployment; you don't have to run `npm build` yourself

          `heroku create antran-clothing --buildpack mars/create-react-app`
          https://antran-clothing.herokuapp.com// | https://git.heroku.com/antran-clothing.git


  REQUIRES
    - Heroku
        - CLI
        - a free acc
    - git
    - Node.js 
-------------------------------------------------

** Automatic deployment:
If you would like to not manually deploy the the app like we have seen in the previous video every time, and you want the app to redeploy anytime you update MASTER in your github repository, then you can set that up through Heroku by following these steps: https://devcenter.heroku.com/articles/github-integration
*/
