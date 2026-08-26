/* ==========================================================================
   GENTIFY ESSENTIALS — Admin Auth Guard
   ========================================================================== */

(function () {
  var auth = firebase.auth();
  var db = firebase.firestore();
  var provider = new firebase.auth.GoogleAuthProvider();

  auth.onAuthStateChanged(function (user) {
    if (user && user.email === "m.abbas.askri@gmail.com") {
      document.getElementById("adminGuard").style.display = "none";
      document.getElementById("adminPanel").style.display = "block";
      document.getElementById("adminEmail").textContent = user.email;

      var letter = document.getElementById("googleUserLetter");
      var dropdownName = document.getElementById("googleDropdownName");
      var name = user.displayName || user.email || "";
      if (letter) letter.textContent = name.charAt(0).toUpperCase();
      if (dropdownName) dropdownName.textContent = name;

      loadAllData();
    } else if (user) {
      document.getElementById("adminGuard").style.display = "block";
      document.getElementById("adminPanel").style.display = "none";
    } else {
      document.getElementById("adminGuard").style.display = "block";
      document.getElementById("adminPanel").style.display = "none";
    }
  });

  var signInBtn = document.getElementById("googleSignInBtn");
  var signOutBtn = document.getElementById("googleSignOutBtn");
  var avatarBtn = document.getElementById("googleAvatarBtn");
  var dropdown = document.getElementById("googleUserDropdown");

  if (signInBtn) {
    signInBtn.addEventListener("click", function () {
      auth.signInWithPopup(provider);
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
})();
