//_______________________Firebase________________________//

// Initialize Firebase
var mykey = myStuff.API_KEY;
let config = {
    apiKey:mykey,
    authDomain: "project-one-1d7a0.firebaseapp.com",
    databaseURL: "https://project-one-1d7a0.firebaseio.com",
    projectId: "project-one-1d7a0",
    storageBucket: "project-one-1d7a0.appspot.com",
    messagingSenderId: "483583667725"
};

firebase.initializeApp(config);
var db = firebase.firestore();
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
        alert('HERE!');
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

reviews.get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        console.log(doc.data());
        renderReviews(doc);
    })
});

function addReview() {
    let comment = $('#comment').val().trim();
    console.log(comment);
    if (!(comment === '')) {
        reviews.doc().set({
            name: name,
            comment: comment
        });
    }
}

// Using vue js to render reviews
var app = new Vue({
    el: '#app',
    data: {
        reviews: []
    }
});

function renderReviews(doc) {
    let review = doc.data().comment;
    let username = doc.data().username;
    app.reviews.push({ key: username, value: review });
}
