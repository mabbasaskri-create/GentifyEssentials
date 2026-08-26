/* ==========================================================================
   GENTIFY ESSENTIALS — Firebase Google Sign-In
   ========================================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyDGUg1O9WzIyM0ZvUq7b-vzsVVulidRrjo",
  authDomain: "gentifyessentials.firebaseapp.com",
  projectId: "gentifyessentials",
  storageBucket: "gentifyessentials.firebasestorage.app",
  messagingSenderId: "1007484414760",
  appId: "1:1007484414760:web:5c03d0a109452f6eeefe1d",
  measurementId: "G-H5ZLDK3PTS"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

function initGoogleAuth() {
  var signInBtn = document.getElementById("googleSignInBtn");
  var signOutBtn = document.getElementById("googleSignOutBtn");
  var avatarBtn = document.getElementById("googleAvatarBtn");
  var dropdown = document.getElementById("googleUserDropdown");

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

  if (signedOut) signedOut.style.display = "none";
  if (signedIn) signedIn.style.display = "flex";

  var name = user.displayName || user.email || "";
  var firstLetter = name.charAt(0).toUpperCase();

  if (letter) letter.textContent = firstLetter;
  if (dropdownName) dropdownName.textContent = name;
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
