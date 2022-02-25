// BACKEND REQUESTS HERE

import axios from "axios";

/**
 * Note: all requests made here at the client side to the backend are possible because:
 * The React app is configured to proxy backend requests to the local Node server (see client/package.json).
 * We have to enable cors in server/server.js.
 **/

// create the user document in Firestore if it doesn't already exist. if the document exists, just return it
export const createUserProfileDocument = (user, signInWithGoogle) => {
  if (!user) return;

  return axios.post("api/createuser/", {
    params: {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      signInWithGoogle,
    },
  });
};

// Verifies if the user has confirmed their email and returns the userSnapshot from Firestore
export const verifyUser = (uid) => {
  if (!uid) return;

  return axios.post("api/verifyuser/", {
    params: { uid },
  });
};

// Send confirmation email to user when they're done signing up with email and password
export const sendSignupConfirmationEmailToUser = (
  name,
  email,
  confirmationCode
) => {
  return axios.post("api/sendsignupemailtouser/", {
    params: { name, email, confirmationCode },
  });
};
