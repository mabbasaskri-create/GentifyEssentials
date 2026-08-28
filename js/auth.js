/* ==========================================================================
   GENTIFY ESSENTIALS — Firebase Init + Google Sign-In
   ========================================================================== */

var ADMIN_EMAIL = "m.abbas.askri@gmail.com";

/* Robust admin check — case-insensitive + trims whitespace so minor
   spelling/case differences in the Google account never hide the
   Admin Panel button. */
function isAdminEmail(email) {
  if (!email) return false;
  return String(email).trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

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
var db = firebase.firestore();
db.enablePersistence({ synchronizeTabs: true }).catch(function () {});
var provider = new firebase.auth.GoogleAuthProvider();

/* ---- Catalog cache (localStorage, ~10 min) ---- */
var CACHE_PREFIX = "gentify_cache_";
var CACHE_TTL_MS = 10 * 60 * 1000;
var _inflight = {};

function cacheGet(key) {
  try {
    var raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    var parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return parsed.data;
  } catch (e) {
    return null;
  }
}

function cacheSet(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ ts: Date.now(), data: data }));
  } catch (e) {
    try {
      ["products", "collections", "settings"].forEach(function (k) {
        if (k !== key) localStorage.removeItem(CACHE_PREFIX + k);
      });
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ ts: Date.now(), data: data }));
    } catch (e2) {}
  }
}

function dedupeFetch(key, fetchFn) {
  if (_inflight[key]) return _inflight[key];
  _inflight[key] = fetchFn().finally(function () {
    delete _inflight[key];
  });
  return _inflight[key];
}

function mergeProductCatalog(list) {
  if (!list || !list.length) return;
  PRODUCTS.length = 0;
  list.forEach(function (p) { PRODUCTS.push(p); });
}
window.mergeProductCatalog = mergeProductCatalog;

function fetchSiteBundleFromNetwork() {
  return Promise.all([
    db.collection("products").orderBy("category").get(),
    db.collection("collections").get(),
    db.collection("settings").doc("site").get()
  ]).then(function (results) {
    var products = [];
    results[0].forEach(function (doc) {
      products.push(Object.assign({ id: doc.id }, doc.data()));
    });
    var collections = [];
    results[1].forEach(function (doc) {
      collections.push(Object.assign({ id: doc.id }, doc.data()));
    });
    var settings = results[2].exists ? results[2].data() : {};
    cacheSet("products", products);
    cacheSet("collections", collections);
    cacheSet("settings", settings);
    return { products: products, collections: collections, settings: settings };
  });
}

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
    if (isAdminEmail(user.email)) {
      adminLink.classList.add("show");
    } else {
      adminLink.classList.remove("show");
    }
  }

  updateMobileAuth();
}

function showSignedOut() {
  var signedOut = document.getElementById("googleSignInBtn");
  var signedIn = document.getElementById("googleUserInfo");
  var dropdown = document.getElementById("googleUserDropdown");

  if (signedOut) signedOut.style.display = "";
  if (signedIn) signedIn.style.display = "none";
  if (dropdown) dropdown.classList.remove("open");

  updateMobileAuth();
}

/* ==========================================================================
   Mobile drawer auth — keep Sign in / Sign out reachable on small screens
   (the header hides Google auth below 480px; the drawer provides it there)
   ========================================================================== */
var GOOGLE_G_SVG =
  '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>';

function updateMobileAuth() {
  var slot = document.getElementById("mobileDrawerAuth");
  if (!slot) return;
  var user = auth.currentUser;

  if (user) {
    var letter = (user.displayName || user.email || "?").charAt(0).toUpperCase();
    var name = user.displayName || user.email || "";
    var adminBtn = "";
    if (isAdminEmail(user.email)) {
      adminBtn =
        '<button class="mobile-drawer-admin" id="mobileAdminBtn" type="button">★ Admin Panel</button>';
    }
    slot.innerHTML =
      '<div class="mobile-user">' +
        '<span class="mobile-user-avatar">' + letter + '</span>' +
        '<div class="mobile-user-name">' + name + '</div>' +
      '</div>' +
      '<button class="mobile-drawer-signout" id="mobileSignOutBtn" type="button">Sign out</button>' +
      adminBtn;
    var so = document.getElementById("mobileSignOutBtn");
    if (so) so.addEventListener("click", function () { auth.signOut(); });
    var ma = document.getElementById("mobileAdminBtn");
    if (ma) ma.addEventListener("click", function () { window.location.href = "admin.html"; });
  } else {
    slot.innerHTML =
      '<button class="google-signin-btn" id="mobileSignInBtn" type="button">' +
        GOOGLE_G_SVG + ' Sign in with Google' +
      '</button>';
    var si = document.getElementById("mobileSignInBtn");
    if (si) si.addEventListener("click", function () {
      auth.signInWithPopup(provider).catch(function (error) {
        console.error("Google sign-in error:", error);
      });
    });
  }
}
window.updateMobileAuth = updateMobileAuth;

/* ---- Firestore helpers ---- */
function fsLoadProducts(callback, onUpdate) {
  var cached = cacheGet("products");
  var fromCache = !!(cached && cached.length);
  if (fromCache) callback(cached);

  dedupeFetch("siteBundle", fetchSiteBundleFromNetwork)
    .then(function (bundle) {
      if (!fromCache) callback(bundle.products);
      else if (onUpdate) onUpdate(bundle.products);
    })
    .catch(function () {
      if (!fromCache) callback(PRODUCTS.slice());
    });
}

function fsLoadSiteBundle(callback, onUpdate) {
  var cachedProducts = cacheGet("products");
  var cachedCollections = cacheGet("collections");
  var cachedSettings = cacheGet("settings");
  var fromCache = !!(cachedProducts || cachedCollections || cachedSettings);

  if (fromCache) {
    callback({
      products: (cachedProducts && cachedProducts.length) ? cachedProducts : PRODUCTS.slice(),
      collections: cachedCollections || [],
      settings: cachedSettings || {}
    });
  }

  dedupeFetch("siteBundle", fetchSiteBundleFromNetwork)
    .then(function (bundle) {
      if (!fromCache) callback(bundle);
      else if (onUpdate) onUpdate(bundle);
    })
    .catch(function () {
      if (!fromCache) {
        callback({
          products: PRODUCTS.slice(),
          collections: [],
          settings: {}
        });
      }
    });
}

function fsSaveProduct(data) {
  var docRef = db.collection("products").doc(data.id);
  return docRef.set(data);
}

function fsDeleteProduct(id) {
  return db.collection("products").doc(id).delete();
}

function fsSaveOrder(order) {
  return db.collection("orders").add(order);
}

function fsLoadOrders(callback) {
  db.collection("orders").orderBy("createdAt", "desc").get().then(function (snap) {
    var list = [];
    snap.forEach(function (doc) {
      list.push(Object.assign({ id: doc.id }, doc.data()));
    });
    callback(list);
  }).catch(function () {
    callback([]);
  });
}

function fsLoadCollections(callback, onUpdate) {
  var cached = cacheGet("collections");
  var fromCache = !!cached;
  if (fromCache) callback(cached);

  dedupeFetch("siteBundle", fetchSiteBundleFromNetwork)
    .then(function (bundle) {
      if (!fromCache) callback(bundle.collections);
      else if (onUpdate) onUpdate(bundle.collections);
    })
    .catch(function () {
      if (!fromCache) callback([]);
    });
}

function fsSaveCollection(data) {
  return db.collection("collections").doc(data.id).set(data);
}

function fsLoadSettings(callback, onUpdate) {
  var cached = cacheGet("settings");
  var fromCache = !!cached;
  if (fromCache) callback(cached);

  dedupeFetch("siteBundle", fetchSiteBundleFromNetwork)
    .then(function (bundle) {
      if (!fromCache) callback(bundle.settings);
      else if (onUpdate) onUpdate(bundle.settings);
    })
    .catch(function () {
      if (!fromCache) callback({});
    });
}

function fsSaveSettings(data) {
  return db.collection("settings").doc("site").set(data, { merge: true });
}

document.addEventListener("DOMContentLoaded", initGoogleAuth);

/* Start Firestore fetch immediately — don't wait for DOMContentLoaded */
dedupeFetch("siteBundle", fetchSiteBundleFromNetwork).catch(function () {});
