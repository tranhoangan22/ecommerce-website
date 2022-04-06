const express = require("express");
const path = require("path");
const enforce = require("express-sslify");
const compression = require("compression");
const firebase_api = require("./firebase.api");
const nodemailer_api = require("./nodemailer.api");
const cors = require("cors");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 4000;

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(compression());

  app.use(
    enforce.HTTPS({
      trustProtoHeader: true,
    })
  );

  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.listen(port, (error) => {
  if (error) throw error;
  console.log("Server running on port " + port);
});

app.get("/service-worker.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "build", "service-worker.js"));
});

app.post("/payment", (req, res) => {
  const body = {
    source: req.body.token.id,
    amount: req.body.amount,
    currency: "usd",
  };

  stripe.charges.create(body, (stripeErr, stripeRes) => {
    if (stripeErr) {
      console.log(stripeErr);
      res.status(500).send({ error: stripeErr });
    } else {
      res.status(200).send({ success: stripeRes });
    }
  });
});

app.post("/api/createuser", firebase_api.createUserDocument);

app.post("/api/verifyuser", firebase_api.verifyUser);

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

app.post("/api/activateuser", firebase_api.activateUser);
