import firebase from "firebase/app";

import "firebase/firestore";
import "firebase/auth";

import _ from "lodash";

const config = {
  apiKey: "AIzaSyBfU1nzmMqlGsKPc2tLU9OTl2O43zMCzdU", // "API_KEY"
  authDomain: "crwn-db-48124.firebaseapp.com", // "PROJECT_ID.firebaseapp.com"
  projectId: "crwn-db-48124", // "PROJECT_ID"
  storageBucket: "crwn-db-48124.appspot.com", // "PROJECT_ID.appspot.com"
  messagingSenderId: "868434671552", // "SENDER_ID"
  appId: "1:868434671552:web:79418d21878005423d3a25", // "APP_ID"
  measurementId: "G-VDXB2ZC001", // "G-MEASUREMENT_ID"
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();

  console.log(
    `Does the user exist in firestore database (ie, does "snapShot" exist at the "userRef" location derived from "userAuth.uid") ? ${
      snapShot.exists ? "YES" : "NO"
    }.`
  );

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (err) {
      console.log("error creating user", err.message);
    }
  }
  return userRef;
};

export const readUserCartDocument = async (id, existingCartItems) => {
  if (!id) return existingCartItems;

  const existingCartItemsMap = convertCartItemsToMap(existingCartItems);

  try {
    const cartRef = firestore.doc(`carts/${id}`);
    const snapShot = await cartRef.get();
    const firestoreCartItemsMap = snapShot.data();

    if (!snapShot.exists) return existingCartItems;

    const mergedMapKeys = _.union(
      Object.keys(existingCartItemsMap),
      Object.keys(firestoreCartItemsMap)
    );

    let mergedMap = {};
    mergedMapKeys.forEach((key) => {
      if (
        existingCartItemsMap.hasOwnProperty(key) &&
        firestoreCartItemsMap.hasOwnProperty(key)
      ) {
        mergedMap[key] = existingCartItemsMap[key];
        mergedMap[key].quantity =
          existingCartItemsMap[key].quantity +
          firestoreCartItemsMap[key].quantity;
      } else if (existingCartItemsMap.hasOwnProperty(key)) {
        mergedMap[key] = existingCartItemsMap[key];
      } else if (firestoreCartItemsMap.hasOwnProperty(key)) {
        mergedMap[key] = firestoreCartItemsMap[key];
      }
    });

    return convertFirestoreMapToCartItems(mergedMap);
  } catch (err) {
    console.log("failed to obtain user cartItems from Firestore. ", err);
    return existingCartItems;
  }
};

export const updateUserCartDocument = async ({ id, cartItems }) => {
  if (!id) return;

  const cartRef = firestore.doc(`carts/${id}`);

  try {
    await cartRef.set({ ...convertCartItemsToMap(cartItems) });
  } catch (err) {
    console.log("error creating user cart", err.message);
  }

  return cartRef;
};

export const convertCartItemsToMap = (cartItems) =>
  cartItems.reduce((accuObj, arrElement) => {
    const name = arrElement.name;
    accuObj[name] = arrElement;
    return accuObj;
  }, {});

export const convertFirestoreMapToCartItems = (firestoreMap) => {
  const cartItems = Object.keys(firestoreMap).map((key) => firestoreMap[key]);
  return cartItems;
};

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = firestore.collection(collectionKey);

  const batch = firestore.batch();

  objectsToAdd.forEach((obj) => {
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj); // newDocRef.set(obj)
  });

  return await batch.commit();
};

export const convertCollectionSnapshotToMap = (collectionSnapshot) => {
  const transformedCollectionArray = collectionSnapshot.docs.map(
    (documentSnapshot) => {
      const { title, items } = documentSnapshot.data();
      return {
        routeName: encodeURI(title.toLowerCase()),
        id: documentSnapshot.id,
        title,
        items,
      };
    }
  );

  const transformedCollectionObject = transformedCollectionArray.reduce(
    (accumulator, documentObj) => {
      accumulator[documentObj.title.toLowerCase()] = documentObj;
      return accumulator;
    },
    {}
  );

  return transformedCollectionObject;
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      unsubscribe();
      resolve(userAuth);
    }, reject);
  });
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export default firebase;
