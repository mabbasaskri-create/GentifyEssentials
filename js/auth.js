/* ==========================================================================
   GENTIFY ESSENTIALS — Google Sign-In (client-side)
   ========================================================================== */

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

function initGoogleAuth() {
  if (typeof google === "undefined" || !google.accounts) {
    setTimeout(initGoogleAuth, 200);
    return;
  }

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleSignIn,
  });

  const signInBtn = document.getElementById("googleSignInBtn");
  if (signInBtn) {
    signInBtn.addEventListener("click", function () {
      google.accounts.id.prompt();
    });
  }

  const signOutBtn = document.getElementById("googleSignOutBtn");
  if (signOutBtn) {
    signOutBtn.addEventListener("click", handleGoogleSignOut);
  }

  const saved = localStorage.getItem("gentify_user");
  if (saved) {
    try {
      showSignedInUser(JSON.parse(saved));
    } catch (e) {
      localStorage.removeItem("gentify_user");
    }
  }
}

function handleGoogleSignIn(response) {
  const payload = parseJwt(response.credential);
  if (!payload) return;

  const user = {
    name: payload.name,
    email: payload.email,
    picture: payload.picture,
  };

  localStorage.setItem("gentify_user", JSON.stringify(user));
  showSignedInUser(user);
}

function showSignedInUser(user) {
  const signedOut = document.getElementById("googleSignInBtn");
  const signedIn = document.getElementById("googleUserInfo");
  const avatar = document.getElementById("googleUserAvatar");
  const name = document.getElementById("googleUserName");

  if (signedOut) signedOut.style.display = "none";
  if (signedIn) signedIn.style.display = "flex";
  if (avatar) avatar.src = user.picture || "";
  if (name) name.textContent = user.name || user.email || "";
}

function handleGoogleSignOut() {
  localStorage.removeItem("gentify_user");

  const signedOut = document.getElementById("googleSignInBtn");
  const signedIn = document.getElementById("googleUserInfo");

  if (signedOut) signedOut.style.display = "";
  if (signedIn) signedIn.style.display = "none";

  if (typeof google !== "undefined" && google.accounts) {
    google.accounts.id.disableAutoSelect();
  }
}

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

document.addEventListener("DOMContentLoaded", initGoogleAuth);
