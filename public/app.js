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
}