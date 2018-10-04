 // Get the current year for the copyright
 $('#year').text(new Date().getFullYear());

 //Initialize Scrollspy
 $('body').scrollspy({ target: '#main-nav' });

 // Smooth Scrolling
 $('#main-nav a').on('click', function (event) {
     if (this.hash !== '') {
         event.preventDefault();

         const hash = this.hash;

         $('html, body').animate({
             scrollTop: $(hash).offset().top
         }, 800, function () {
             window.location.hash = hash;
         });
     }
 });

 //_______________________Firebase________________________//

 // Initialize Firebase
 var mykey = myStuff.API_KEY;
 let config = {
     apiKey: mykey,
     authDomain: "project-one-1d7a0.firebaseapp.com",
     databaseURL: "https://project-one-1d7a0.firebaseio.com",
     projectId: "project-one-1d7a0",
     storageBucket: "project-one-1d7a0.appspot.com",
     messagingSenderId: "483583667725"
 };

 firebase.initializeApp(config);

 // FirebaseUI config.
 let uiConfig = {
     signInSuccessUrl: 'index.html',
     signInOptions: [
         // Leave the lines as is for the providers you want to offer your users.
         firebase.auth.GoogleAuthProvider.PROVIDER_ID,
         firebase.auth.EmailAuthProvider.PROVIDER_ID
     ],
     // tosUrl and privacyPolicyUrl accept either url string or a callback
     // function.
     // Terms of service url/callback.
     tosUrl: '<your-tos-url>',
     // Privacy policy url/callback.
     privacyPolicyUrl: function() {
         window.location.assign('<your-privacy-policy-url>');
     }
 };

 // Initialize the FirebaseUI Widget using Firebase.
 let ui = new firebaseui.auth.AuthUI(firebase.auth());


 $(document).ready(function () {
    $('#submit').on('click', function () {
        $('.review-form').css('display', 'none');
        $('#firebaseui-auth-container').css('display', 'block');
        ui.start('#firebaseui-auth-container', uiConfig);
    })
 });

 firebase.auth().onAuthStateChanged(function(user) {
     if (user) {
        alert('Your review has been submitted');
     } else {
         console.log('no user signed in');
     }
 });