/* ADD FIREBASE TO A WEBAPP https://firebase.google.com/docs/web/setup
  step 1: Create a firebase project
  step 2: register your app with firebase
  step 3: add firebase SDKs and initialize firebase https://firebase.google.com/docs/reference/js
  step 4: (optional) install CLI and deploy to firebase hosting
  step 5: access firebase in your app

  our project: https://console.firebase.google.com/project/crwn-db-48124/authentication/users
*/

// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app"; // the `firebase` keyword will give us acess to AUTH and FIRESTORE when we import them which will be automatically attached to the `firebase` keyword

// Add the Firebase products that we want to use
import "firebase/firestore";
import "firebase/auth";

import _ from "lodash";

// To initialize Firebase in your app, you need to provide your app's Firebase project configuration
const config = {
  apiKey: "AIzaSyBfU1nzmMqlGsKPc2tLU9OTl2O43zMCzdU", // "API_KEY"
  authDomain: "crwn-db-48124.firebaseapp.com", // "PROJECT_ID.firebaseapp.com"
  projectId: "crwn-db-48124", // "PROJECT_ID"
  storageBucket: "crwn-db-48124.appspot.com", // "PROJECT_ID.appspot.com"
  messagingSenderId: "868434671552", // "SENDER_ID"
  appId: "1:868434671552:web:79418d21878005423d3a25", // "APP_ID"
  measurementId: "G-VDXB2ZC001", // "G-MEASUREMENT_ID"
};

/**
 * take the user auth object that we get back from our authentication library and store it in our firestore database
 * since we're making an API request, this is a asynchronous action
 * */
export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return; // if the `userAuth` object is null, we want to exit from this function

  /*
    `queryReference` object:
      - points to the current place (a document or a collection) in the database that we're querying
      - we get... by calling...
          - `documentRef`: 
                firestore.doc(`/users/:userId);
          - `collectionRef`: 
                firestore.collection(`/users`);
      - does not have actual data of the collection of document. instead, it has: 
          - properties that tell us details about it
          - method to give us the Snapshot object which gives us the data
      - `documentReference` vs `collectionReference`
          - `documentRef` is used to perform CRUD (create, retrieve, update, delete) methods .set(), .get(), .update(), .delete()
          - `documentRef.get()` returns a `documentSnapshot` object
          - `collectionRef.get()` returns a `querySnapshot` (ie, `collectionSnapshot`) object
          - `collectionRef.onSnapshot(snapshot => {..})
  */
  const userRef = firestore.doc(`users/${userAuth.uid}`); // get the "query reference" for the document we want to to CRUD on, in the `users` collection, based on the user UID obtained from the `userAuth` object. `userRef` may or may not point to existing data.
  const snapShot = await userRef.get(); // get the snapShot which gives us the data (the user) we're looking for

  /*
    `documentSnapshot` object (or `queryDocumentSnapshot`):
      - allows us to check if a document exists at this query using `exists` property which returns a boolean
      - get the data (the document) by calling `.data()` method, which returns a JSON object of the document 
    
    IF THE THE SNAPSHOT OBJECT (`snapShot`) DOESN'T EXISTS IN THE FIRESTORE DATABASE, CREATE ONE AT THE userRef (FOR SIGN-UP CASE)
      - the new document will be created into the `users` collection 

    `collectionSnapshot` object 
      - we get a `collectionSnapshot` object from our `collectionRef` object 
      - we can check if there are any documents in the collection by calling the `.empty` property of the `collectionSnapshot`, which returns a boolean
      - we can get all the documents by calling the `.docs` property of the `collectionSnapshot`, it returns an array of `documentSnapshot` objects

    `queryCollectionSnapshot`: https://firebase.google.com/docs/firestore/query-data/queries#web-version-8 
      - is an object of documentSnapshots' objects found from the query

  */

  console.log(
    `Does the user exist in firestore database (ie, does "snapShot" exist at the "userRef" location derived from "userAuth.uid") ? ${
      snapShot.exists ? "YES" : "NO"
    }.`
  );

  // IF THE THE SNAPSHOT OBJECT (`snapShot`) DOESN'T EXISTS IN THE FIRESTORE DATABASE, CREATE ONE AT THE userRef (FOR SIGN-UP CASE)
  if (!snapShot.exists) {
    const { displayName, email } = userAuth; // destructuring to get the kinds of data we want to store from the `userAuth` object
    const createdAt = new Date(); // record the current time the creation of the new document in the `users` collectiont takes place

    // make an (asynchronous) request to firestore database to store the data at the `userRef` location (ie, as new document in the `users` collection) (the `snapShot` object will be populated with this data)
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData, // note `additionalData` is an object
      });
    } catch (err) {
      console.log("error creating user", err.message);
    }
  }
  return userRef; // there's a chance that we may want to use userRef to do other things
};

export const readUserCartDocument = async (id, existingCartItems) => {
  if (!id) return existingCartItems;

  const existingCartItemsMap = convertCartItemsToMap(existingCartItems);

  try {
    const cartRef = firestore.doc(`carts/${id}`);
    const snapShot = await cartRef.get();
    const firestoreCartItemsMap = snapShot.data();

    if (!snapShot.exists) return existingCartItems; // if there's no document at this cartRef (this user doesn't have any saved cartItems), return the existing cartItems

    // merge 2 arrays without duplicates: the existing cartItems (in redux store) with the cartItems tied to this user id on firestore
    const mergedMapKeys = _.union(
      Object.keys(existingCartItemsMap),
      Object.keys(firestoreCartItemsMap)
    );

    // merge the existing cartItems object with the cartItems object obtained from Firestore
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

    return convertFirestoreMapToCartItems(mergedMap); // convert the merged object to the array format to store
  } catch (err) {
    console.log("failed to obtain user cartItems from Firestore. ", err);
    return existingCartItems;
  }
};

// upload user's cartItems to Firestore at /carts/userID
export const updateUserCartDocument = async ({ id, cartItems }) => {
  if (!id) return;

  const cartRef = firestore.doc(`carts/${id}`);

  // save the cartItems from the redux store (state.cart.cartItems) onto firestore
  try {
    await cartRef.set({ ...convertCartItemsToMap(cartItems) });
  } catch (err) {
    console.log("error creating user cart", err.message);
  }

  return cartRef;
};

// convert the cartItems, which is an array, into an object to be stored on firestore
export const convertCartItemsToMap = (cartItems) =>
  cartItems.reduce((accuObj, arrElement) => {
    const name = arrElement.name;
    accuObj[name] = arrElement;
    return accuObj;
  }, {});

// convert the object obtained from Firestore into the array `cartItems` which, when the user signs in, will be stored in Redux, and populated in the UI (cart)
export const convertFirestoreMapToCartItems = (firestoreMap) => {
  const cartItems = Object.keys(firestoreMap).map((key) => firestoreMap[key]);
  return cartItems;
};

/*
 ** A utility to add the shop collections from our code base to firestore
 */
export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  // create a new collection named `collectionKey`. If there exists a collection named `collectionKey` already in firestore, return the corresponding `collectionRef`
  const collectionRef = firestore.collection(collectionKey);

  // a batch write: group all the calls together into 1 big request. Firestore gives us a "batch object"
  const batch = firestore.batch();

  // `forEach` calls a function on each element of the array `objectsToAdd` -> looping
  objectsToAdd.forEach((obj) => {
    // create us a new document in this collection `collectionRef` pointing to `newDocRef` and having a randomly generated `id` (which is a property of `newDocRef` and which is also the name of that respective document in Firestore)
    const newDocRef = collectionRef.doc();
    // loop throug the array and batch these calls together
    batch.set(newDocRef, obj); // newDocRef.set(obj)
  });

  // `batch.commit` fires off our batch request. returns a Promise which resolves to a void value (a null value) when the batch write is successful
  return await batch.commit();
};

/*
 ** A utility function
 **  - get the whole collectionSnapshot
 **  - convert it to an appropriately formatted object (called `transformedCollectionObject`, ie a map) with existing properties and an additonal property (the route property) to be used in our app
 */
export const convertCollectionSnapshotToMap = (collectionSnapshot) => {
  // returns an array of objects in the right format w additional properties (routeName, id)
  const transformedCollectionArray = collectionSnapshot.docs.map(
    (documentSnapshot) => {
      const { title, items } = documentSnapshot.data();
      return {
        // note, routeName is the same as title, just in lower case
        routeName: encodeURI(title.toLowerCase()), // return a string where any characters that the URL cannot process (eg, certain symbols, spaces, etc.) are converted to a version that the URL can read
        id: documentSnapshot.id, // use id from the firestore id for each documentSnapshot
        title,
        items,
      };
    }
  );

  // convert the `transformedCollection` from an array of documentObj to an object of documentObj. Note that the `reduce()` function returns a new value and doesn't modify the existing array on which it operates
  const transformedCollectionObject = transformedCollectionArray.reduce(
    (accumulator, documentObj) => {
      accumulator[documentObj.title.toLowerCase()] = documentObj;
      return accumulator;
    },
    {}
  );

  return transformedCollectionObject;
};

/*
The recommended way to get the current user is by setting an observer on the Auth object. https://firebase.google.com/docs/auth/web/manage-users
If a user isn't signed in, currentUser is null.
*/
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    // add an observer to changes in the user sign-in state, this will sort of "remember" the userAuth state at all times..
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      // API request
      unsubscribe();
      resolve(userAuth);
    }, reject); // if it fails, we reject with whatever error we get back
  });
};

// Initialize Firebase
firebase.initializeApp(config);

export const auth = firebase.auth(); // Get the Auth service for the default app
export const firestore = firebase.firestore();

// https://firebase.google.com/docs/auth/web/google-signin#web-v8
export const googleProvider = new firebase.auth.GoogleAuthProvider(); // Create an instance of the Google provider object
googleProvider.setCustomParameters({ prompt: "select_account" }); // if you want the user to be able to choose from multiple Google accounts that they might have (instead of just the primary account), you should include this parameter.

// Authenticate with Firebase using the Google provider object.
// You can prompt your users to sign in with their Google Accounts by opening a pop-up window
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider); // this will be imported in our `sign-in` component

export default firebase;
