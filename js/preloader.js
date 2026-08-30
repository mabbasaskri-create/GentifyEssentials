/* ==========================================================================
   GENTIFY ESSENTIALS — page preloader
   Shows a branded "GENTIFY ESSENTIALS" loader on a visitor's FIRST page
   load and keeps it up until the Firebase product images (plus hero and
   collection artwork) have loaded properly. Returning visitors get a
   quick, smooth brand flash instead of the full wait.
   ========================================================================== */

(function () {
  var loader = document.getElementById("pageLoader");
  if (!loader) return;

  var FLAG = "gentify_preloader_seen";
  var MAX_WAIT_MS = 12000;
  var IMG_TIMEOUT_MS = 16000;
  var GRACE_MS = 500;
  var MIN_NO_IMG_MS = 2500;

  var started = Date.now();
  var hidden = false;
  var dataReady = false;
  var registered = {};
  var pending = {};
  var graceTimer = null;
  var needsData = !!document.querySelector("#premiumGrid, #productGrid");

  function setSeen() {
    try { localStorage.setItem(FLAG, "1"); } catch (e) {}
  }

  function hide() {
    if (hidden) return;
    hidden = true;
    loader.classList.add("hide");
    setSeen();
    setTimeout(function () {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
    }, 700);
  }

  function register(url) {
    if (!url || registered[url]) return;
    registered[url] = true;
    pending[url] = true;

    var done = false;
    var finish = function () {
      if (done) return;
      done = true;
      pending[url] = false;
      checkSoon();
    };

    var img = new Image();
    img.decoding = "async";
    img.onload = finish;
    img.onerror = finish;
    img.src = url;

    setTimeout(finish, IMG_TIMEOUT_MS);
  }

  function checkSoon() {
    clearTimeout(graceTimer);
    graceTimer = setTimeout(tryHide, GRACE_MS);
  }

  function tryHide() {
    if (hidden) return;
    if (Date.now() - started >= MAX_WAIT_MS) { hide(); return; }

    if (needsData && !dataReady) return;

    var urls = Object.keys(registered);
    if (!urls.length) {
      if (Date.now() - started >= MIN_NO_IMG_MS) hide();
      return;
    }

    var allDone = urls.every(function (u) { return !pending[u]; });
    if (allDone) hide();
  }

  function scan() {
    document.querySelectorAll("img").forEach(function (img) {
      var src = img.currentSrc || img.getAttribute("src") || "";
      if (src) register(src);
    });
    document.querySelectorAll("[style*='background-image']").forEach(function (el) {
      var re = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;
      var m;
      var bg = el.style.backgroundImage || "";
      while ((m = re.exec(bg)) !== null) register(m[2]);
    });
  }

  var obs = new MutationObserver(scan);
  obs.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src", "style"]
  });

  /* ---- Public hooks used by the catalog render pipelines ---- */
  window.pageLoaderReady = function () {
    dataReady = true;
    checkSoon();
  };
  window.pageLoaderTrack = function (urls) {
    if (!urls) return;
    (Array.isArray(urls) ? urls : [urls]).forEach(register);
  };

  var seen = false;
  try { seen = localStorage.getItem(FLAG) === "1"; } catch (e) {}

  if (seen) {
    /* Already shown to this visitor before — just a short brand flash. */
    setTimeout(hide, 250);
  } else {
    scan();
    tryHide();
    window.addEventListener("load", function () { checkSoon(); });
  }
})();