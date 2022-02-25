// Firebase Ver. 8

/**
 * Using Admin SDK (with serviceAccount key obtained from our firebase project, we can bypass Cloud Firestore security rule when we make request from our NodeJs backend server!
 * https://firebase.google.com/docs/admin/setup
 * https://medium.com/feedflood/write-to-cloud-firestore-using-node-js-server-c84859fefb86
 **/
const firebase = require("firebase-admin");
const { applicationDefault } = require("firebase-admin/app");

// const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
// initialize admin SDK using serciceAccountKey.
firebase.initializeApp({
  credential: applicationDefault(), // look for GOOGLE_APPLICATION_CREDENTIALS env variable
  // credential: firebase.credential.cert(serviceAccount),
});

const db = firebase.firestore();
////////////////////////////////////////////////////////////////////////////////////////////

const tokenize = require("./encode"); // use to generate the JWT for creating confirmationCode

// create new user document in database and return it. if the document exists, just return it
const createUserDocument = async (req, res) => {
  const userRef = db.doc(`users/${req.body.params.uid}`);
  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email, signInWithGoogle } = req.body.params;
    const createdAt = new Date();
    const confirmationCode = tokenize(email, process.env.JWT_SECRET);

    /**
     * Default value of status is pending. It will be updated to active when the user clicked the link in the email which they will receive.
     * When the user signs in with Email and Password, only the one with status of active will be signed in.
     * When user signs in with Google, the status will always be `active` but the user will automatically be signed in anyway so this doesn't matter
     */
    const status = signInWithGoogle ? "active" : "pending";

    const newDocument = {
      displayName,
      email,
      createdAt,
      confirmationCode,
      status,
    };

    try {
      await userRef.set(newDocument);
      res.status(200).send(newDocument);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Error creating the user document in Firestore database!",
      });
    }
  } else {
    const id = snapShot.id;
    res.status(200).send({ id, ...snapShot.data() });
  }
};

const updateUserContactInfo = async (req, res) => {
  const { userName, email, message, createdAt } = req.body.params;
  const id = email + "_" + createdAt;

  const contactInfoRef = db.doc(`contactinfo/${id}`);

  try {
    await contactInfoRef.set({ createdAt, userName, email, message });
    res.status(200).send("Successfully saved user contact info to database!");
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error creating the user document in Firestore database!",
    });
  }
};

// verify if the user has confirmed their email. if yes, return the user document.
const verifyUser = async (req, res) => {
  try {
    const userRef = db.doc(`users/${req.body.params.uid}`);
    const snapShot = await userRef.get();

    if (!snapShot) {
      res.status(401).send({
        message: "User doesn't exist or password is incorrect",
      });
    }

    if (snapShot.data().status == "active") {
      const id = snapShot.id;
      res.status(200).send({ id, ...snapShot.data() });
    } else {
      res.status(401).send({
        message: "Pending Account. Please Verify Your Email!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "failed to verify user",
      err,
    });
  }
};

// activate user when they clicked the link in the confirmation email
const activateUser = async (req, res) => {
  const usersRef = await db.collection("users");

  // const userCollection = await usersRef.get();
  // const allDocsSnapshot = await userCollection.docs;
  // const allDocs = allDocsSnapshot.map((snapshot) => snapshot.data());
  // console.log(allDocs);

  let userId, userDocument;

  try {
    // query for the document with confirmationCode in the collection `users`
    const query = await usersRef.where(
      "confirmationCode",
      "==",
      req.body.params.confirmationCode
    );
    const querySnapshot = await query.get(); // querySnapshot is an object of documentSnapshot(s)

    // Note: firestore's querySnapshot object has a method also called `forEach`: https://firebase.google.com/docs/reference/node/firebase.firestore.QuerySnapshot
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data()); // doc.data() is never undefined for query doc snapshots
      userId = doc.id;
      userDocument = doc.data(); // there is only one found userDocument
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error querying for the user with the provided confirmationCode",
    });
  }

  // activate the user
  userDocument.status = "active";

  const userRef = db.doc(`users/${userId}`);

  // write the new userDocument back to firestore
  try {
    await userRef.set(userDocument);
    res
      .status(200)
      .send(
        "Your email has been confirmed. You can now login. Have fun shopping with us!"
      );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error updating the newUser document in Firestore database!",
    });
  }
};

module.exports = {
  createUserDocument,
  verifyUser,
  activateUser,
  updateUserContactInfo,
};
