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
  const signInBtn = document.getElementById("googleSignInBtn");
  const signOutBtn = document.getElementById("googleSignOutBtn");

  if (signInBtn) {
    signInBtn.addEventListener("click", function () {
      auth.signInWithPopup(provider).catch(function (error) {
        console.error("Google sign-in error:", error);
      });
    });
  }

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
  const signedOut = document.getElementById("googleSignInBtn");
  const signedIn = document.getElementById("googleUserInfo");
  const avatar = document.getElementById("googleUserAvatar");
  const name = document.getElementById("googleUserName");

  if (signedOut) signedOut.style.display = "none";
  if (signedIn) signedIn.style.display = "flex";
  if (avatar) avatar.src = user.photoURL || "";
  if (name) name.textContent = user.displayName || user.email || "";
}

function showSignedOut() {
  const signedOut = document.getElementById("googleSignInBtn");
  const signedIn = document.getElementById("googleUserInfo");

  if (signedOut) signedOut.style.display = "";
  if (signedIn) signedIn.style.display = "none";
}

document.addEventListener("DOMContentLoaded", initGoogleAuth);
