//_______________________Firebase________________________//

// Initialize Firebase
let mykey = myStuff.API_KEY;
let config = {
    apiKey:mykey,
    authDomain: "project-one-1d7a0.firebaseapp.com",
    databaseURL: "https://project-one-1d7a0.firebaseio.com",
    projectId: "project-one-1d7a0",
    storageBucket: "project-one-1d7a0.appspot.com",
    messagingSenderId: "483583667725",
    appId: "1:483583667725:web:b0515ae234d9b87855af44"
};
firebase.initializeApp(config);
let db = firebase.firestore();
db.settings({timestampsInSnapshots: true});

let user = firebase.auth().currentUser;
let name, email, photoUrl, uid, emailVerified;

// tracks if user is logged in
let isIn = false;

if (user != null) {
    name = user.displayName;
    email = user.email;
    photoUrl = user.photoURL;
    emailVerified = user.emailVerified;
    uid = user.uid;
}


$(document).ready(function () {

    $('#uilogin').on('click', function () {

        if (!isIn) {
            location.href = "login.html";
        } else {
            firebase.auth().signOut().then(function() {
                // Sign-out successful.
            }).catch(function(error) {
                // An error happened.
            });
            location.reload();
        }
    });

    $('#submit').on('click', function () {
        // Prevent form from submitting
        event.preventDefault();
        addReview();
    });
});

// Tracks the user's login state and updates the DOM
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log('user signed in');
        $('#uilogin').text("Logout");
        $('#fav').css('display', 'block');
        $('.review-form').css('display', 'block');
        isIn = true;
    } else {
        console.log('no user signed in');
        $('#uilogin').text("Login");
        $('#fav').css('display', 'none');
        isIn = false;
    }
});

//______Render Reviews From Database____//
// Get a reference to the database service
let reviews = db.collection('reviews');

function addReview() {
    let comment = $('#comment').val().trim();
    let username = $('#name').val().trim();

    if ((comment !== '') && (username !== '')) {
        reviews.add({
            username: username,
            comment: comment
        }).then(function() {
            console.log("Document successfully written!");
            $("#myForm")[0].reset();
        }).catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }
}

// Using vue js to render reviews
let app = new Vue({
    el: '#app',
    data: {
        reviews: []
    }
});

// Get realtime updates
reviews.onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type === 'added') {
            renderReviews(change.doc);
        }
    })
});

function renderReviews(doc) {
    let username = doc.data().username;
    let review = doc.data().comment;
    app.reviews.push({ name: username, review: review });
}


