/* ==========================================================================
   GENTIFY ESSENTIALS — Firebase Google Sign-In
   ========================================================================== */

var ADMIN_EMAIL = "m.abbas.askri@gmail.com";

var firebaseConfig = {
  apiKey: "AIzaSyDGUg1O9WzIyM0ZvUq7b-vzsVVulidRrjo",
  authDomain: "gentifyessentials.firebaseapp.com",
  projectId: "gentifyessentials",
  storageBucket: "gentifyessentials.firebasestorage.app",
  messagingSenderId: "1007484414760",
  appId: "1:1007484414760:web:5c03d0a109452f6eeefe1d",
  measurementId: "G-H5ZLDK3PTS"
};

firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var provider = new firebase.auth.GoogleAuthProvider();

function initGoogleAuth() {
  var signInBtn = document.getElementById("googleSignInBtn");
  var signOutBtn = document.getElementById("googleSignOutBtn");
  var avatarBtn = document.getElementById("googleAvatarBtn");
  var dropdown = document.getElementById("googleUserDropdown");
  var adminLink = document.getElementById("googleAdminLink");

  if (signInBtn) {
    signInBtn.addEventListener("click", function () {
      auth.signInWithPopup(provider).catch(function (error) {
        console.error("Google sign-in error:", error);
      });
    });
  }

  if (avatarBtn) {
    avatarBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });
  }

  document.addEventListener("click", function (e) {
    if (dropdown && !dropdown.contains(e.target) && e.target !== avatarBtn) {
      dropdown.classList.remove("open");
    }
  });

  if (signOutBtn) {
    signOutBtn.addEventListener("click", function () {
      auth.signOut();
    });
  }

  if (adminLink) {
    adminLink.addEventListener("click", function () {
      window.location.href = "admin.html";
    });
  }

  auth.onAuthStateChanged(function (user) {
    if (user) {
      showSignedInUser(user);
    } else {
      showSignedOut();
    }
  });
}

function showSignedInUser(user) {
  var signedOut = document.getElementById("googleSignInBtn");
  var signedIn = document.getElementById("googleUserInfo");
  var letter = document.getElementById("googleUserLetter");
  var dropdownName = document.getElementById("googleDropdownName");
  var adminLink = document.getElementById("googleAdminLink");

  if (signedOut) signedOut.style.display = "none";
  if (signedIn) signedIn.style.display = "flex";

  var name = user.displayName || user.email || "";
  var firstLetter = name.charAt(0).toUpperCase();

  if (letter) letter.textContent = firstLetter;
  if (dropdownName) dropdownName.textContent = name;

  if (adminLink) {
    if (user.email === ADMIN_EMAIL) {
      adminLink.classList.add("show");
    } else {
      adminLink.classList.remove("show");
    }
  }
}

function showSignedOut() {
  var signedOut = document.getElementById("googleSignInBtn");
  var signedIn = document.getElementById("googleUserInfo");
  var dropdown = document.getElementById("googleUserDropdown");

  if (signedOut) signedOut.style.display = "";
  if (signedIn) signedIn.style.display = "none";
  if (dropdown) dropdown.classList.remove("open");
}

document.addEventListener("DOMContentLoaded", initGoogleAuth);
