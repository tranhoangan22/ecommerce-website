import axios from "axios";
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

export const verifyUser = (uid) => {
  if (!uid) return;

  return axios.post("api/verifyuser/", {
    params: { uid },
  });
};

export const sendSignupConfirmationEmailToUser = (
  name,
  email,
  confirmationCode
) => {
  return axios.post("api/sendsignupemailtouser/", {
    params: { name, email, confirmationCode },
  });
};
