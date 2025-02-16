document.addEventListener('DOMContentLoaded', event => {
    const app = firebase.app();
})

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            document.write(`Hello ${user.displayName}`);
            console.log(user);

            const db = firebase.firestore();
            db.collection('users').doc(user.uid).set({
                name: user.displayName,
                email: user.email
            }).then(() => {
                console.log('User data saved to Firestore');
            }).catch(console.log);
        })
        .catch(console.log)
}<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to Firebase Hosting</title>

    <!-- update the version number as needed -->
    <script defer src="/__/firebase/11.3.1/firebase-app-compat.js"></script>
    <!-- include only the Firebase features as you need -->
    <script defer src="/__/firebase/11.3.1/firebase-auth-compat.js"></script>
    <script defer src="/__/firebase/11.3.1/firebase-database-compat.js"></script>
    <script defer src="/__/firebase/11.3.1/firebase-firestore-compat.js"></script>
    <script defer src="/__/firebase/11.3.1/firebase-functions-compat.js"></script>
    <script defer src="/__/firebase/11.3.1/firebase-messaging-compat.js"></script>
    <script defer src="/__/firebase/11.3.1/firebase-storage-compat.js"></script>
    <script defer src="/__/firebase/11.3.1/firebase-remote-config-compat.js"></script>

    <!-- 
      initialize the SDK after all desired features are loaded, set useEmulator to false
      to avoid connecting the SDK to running emulators.
    -->
      
    <button onclick="googleLogin()">

      Login with Google

    </button>
    <script src="app.js"></script>
  </body>
</html>
