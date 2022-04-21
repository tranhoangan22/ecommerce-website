# Ecommerce website

## Tech stack
react, redux, redux-saga, styled-components, firebase, nodejs, epxressjs, heroku

## Features
- User can login with Google or with a chosen pair of email and password after registration
- If the user registers with email and password, an email containing a verification link is sent to the registered email. Upon clicking on the verification link, the user is verifed and and then can login
- The user information (name, email, password, verification status) is stored in a database (firebase/firestore)
- The user's selected cart items are stored in database when the user logs out. When ther user logs in, the cart items stored in database are retrieved and populated in the cart UI together with the currently selected cart items.
- User cand send a contact information and the contact information will be stored in database
