/* ==========================================================================
   GENTIFY ESSENTIALS — product catalog
   Prices in PKR. Images are locally generated SVG swatches standing in
   for real product photography — swap the `image` paths for real shots.
   ========================================================================== */

const PRODUCTS = [
  // ---------------- CAPS ----------------
  { id:"cap-01", category:"caps", name:"Navy Snapback", price:2200, oldPrice:2800, badge:"Sale", rating:4.8, reviews:64,
    image:"img/cap-01.svg",
    desc:"A structured six-panel snapback in brushed navy cotton twill with a tonal gold eyelet trim. Adjustable snap closure, curved peak.", tags:["Bestseller"] },
  { id:"cap-02", category:"caps", name:"Classic White Cap", price:1900, rating:4.9, reviews:88, badge:"Bestseller",
    image:"img/cap-02.svg",
    desc:"Our signature dad cap in heavyweight white cotton with a low profile crown and unstructured brim for an easy, worn-in fit." },
  { id:"cap-03", category:"caps", name:"Charcoal Wool Flatcap", price:3400, rating:4.7, reviews:31,
    image:"img/cap-03.svg",
    desc:"A tailored flatcap woven from Italian wool blend, lined in breathable cotton — built for cooler weather and a sharper silhouette." },
  { id:"cap-04", category:"caps", name:"Olive Field Cap", price:2100, rating:4.6, reviews:22,
    image:"img/cap-04.svg",
    desc:"Military-inspired field cap in washed olive cotton canvas with a soft brim and brass ventilation eyelets." },
  { id:"cap-05", category:"caps", name:"Gold Line Trucker", price:2500, badge:"New", rating:4.8, reviews:14,
    image:"img/cap-05.svg",
    desc:"Mesh-back trucker cap with a foam front panel and a single embroidered gold hairline — breathable and built for daily rotation." },
  { id:"cap-06", category:"caps", name:"Burgundy Corduroy Cap", price:2300, rating:4.5, reviews:19,
    image:"img/cap-06.svg",
    desc:"Wide-wale corduroy six-panel with a soft unstructured crown, finished with a leather strap-back closure." },
  { id:"cap-07", category:"caps", name:"Ivory Weekend Cap", price:2000, rating:4.7, reviews:27,
    image:"img/cap-07.svg",
    desc:"A relaxed twill cap in soft ivory, garment-washed for a lived-in texture and finished with tonal stitching." },

  // ---------------- WATCHES ----------------
  { id:"watch-01", category:"watches", name:"Heritage Chronograph", price:18500, oldPrice:22000, badge:"Sale", rating:4.9, reviews:52,
    image:"img/watch-01.svg",
    desc:"A 42mm stainless case chronograph with sunburst navy dial, sapphire crystal, and a genuine leather strap. Water resistant to 5ATM.", tags:["Bestseller"] },
  { id:"watch-02", category:"watches", name:"Pilot Automatic", price:24900, badge:"Bestseller", rating:4.8, reviews:41,
    image:"img/watch-02.svg",
    desc:"Automatic movement pilot-style watch with an oversized crown, luminous markers, and a rugged canvas NATO strap." },
  { id:"watch-03", category:"watches", name:"Gold Line Dress Watch", price:16900, rating:4.7, reviews:23,
    image:"img/watch-03.svg",
    desc:"A slim 38mm dress watch with a champagne dial, gold-tone indices, and a hand-stitched brown leather strap." },
  { id:"watch-04", category:"watches", name:"Steel Diver 200m", price:21000, rating:4.8, reviews:35, badge:"New",
    image:"img/watch-04.svg",
    desc:"A robust dive-ready watch with a unidirectional bezel, screw-down crown, and 200m water resistance on a steel bracelet." },
  { id:"watch-05", category:"watches", name:"Minimalist Mesh", price:13500, rating:4.6, reviews:18,
    image:"img/watch-05.svg",
    desc:"A clean-dial quartz watch with a slim case and a fine stainless mesh band — pairs equally well with tailoring or denim." },
  { id:"watch-06", category:"watches", name:"Field Explorer", price:19900, rating:4.7, reviews:20,
    image:"img/watch-06.svg",
    desc:"A durable field watch with a matte dial, olive nylon strap, and shock-resistant case built for daily wear outdoors." },
  { id:"watch-07", category:"watches", name:"Classic Two-Tone", price:23500, rating:4.9, reviews:29,
    image:"img/watch-07.svg",
    desc:"A timeless two-tone bracelet watch pairing polished steel with warm gold accents on a jubilee-style band." },

  // ---------------- PERFUMES ----------------
  { id:"perf-01", category:"perfumes", name:"Noir Oud EDP", price:8900, badge:"Bestseller", rating:4.9, reviews:73,
    image:"img/perf-01.svg",
    desc:"A deep, smoky oud fragrance layered with amber and dark musk. Eau de Parfum, 100ml, 8–10hr projection.", tags:["Bestseller"] },
  { id:"perf-02", category:"perfumes", name:"Vetiver Blanc", price:7400, rating:4.7, reviews:38,
    image:"img/perf-02.svg",
    desc:"A crisp, green vetiver built on citrus top notes and a clean cedar base — a versatile daytime signature. 100ml EDT." },
  { id:"perf-03", category:"perfumes", name:"Amber & Tobacco", price:9600, oldPrice:11200, badge:"Sale", rating:4.8, reviews:29,
    image:"img/perf-03.svg",
    desc:"Warm tobacco leaf and honeyed amber wrapped around a base of sandalwood — rich enough for evening wear. 100ml EDP." },
  { id:"perf-04", category:"perfumes", name:"Bergamot Steel", price:6800, badge:"New", rating:4.6, reviews:16,
    image:"img/perf-04.svg",
    desc:"A sharp aquatic-citrus opening over a mineral, steel-cool base — built for warm days and long summers. 100ml EDT." },
  { id:"perf-05", category:"perfumes", name:"Leather & Sage", price:8200, rating:4.8, reviews:24,
    image:"img/perf-05.svg",
    desc:"Supple leather accord balanced with clary sage and a soft vanilla drydown. A study in understated confidence. 100ml EDP." },
  { id:"perf-06", category:"perfumes", name:"Cedar & Citron", price:7000, rating:4.5, reviews:20,
    image:"img/perf-06.svg",
    desc:"Bright Sicilian citron over dry cedarwood and a whisper of black pepper — a clean, confident everyday scent. 100ml EDT." },
  { id:"perf-07", category:"perfumes", name:"Midnight Spice", price:9200, rating:4.9, reviews:33,
    image:"img/perf-07.svg",
    desc:"Cardamom and black pepper over a smoldering base of oud and dark chocolate — built for cold nights. 100ml EDP." },

  // ---------------- T-SHIRTS ----------------
  { id:"tee-01", category:"tshirts", name:"Signature Crest Tee", price:2800, badge:"Bestseller", rating:4.8, reviews:57,
    image:"img/tee-01.svg",
    desc:"A heavyweight 240gsm cotton tee with a tonal embroidered crest at the chest. Garment-dyed for a soft, broken-in hand feel.", tags:["Bestseller"],
    sizes:["S","M","L","XL","XXL"] },
  { id:"tee-02", category:"tshirts", name:"Ivory Essential Tee", price:2400, rating:4.7, reviews:44,
    image:"img/tee-02.svg",
    desc:"Our everyday tee — a boxy, relaxed cut in combed cotton jersey with a reinforced rib collar that holds its shape.", sizes:["S","M","L","XL"] },
  { id:"tee-03", category:"tshirts", name:"Charcoal Pocket Tee", price:2600, rating:4.6, reviews:21,
    image:"img/tee-03.svg",
    desc:"A classic pocket tee in heather charcoal, cut from mid-weight cotton with a slightly dropped shoulder.", sizes:["S","M","L","XL","XXL"] },
  { id:"tee-04", category:"tshirts", name:"Olive Henley", price:3100, badge:"New", rating:4.8, reviews:12,
    image:"img/tee-04.svg",
    desc:"A three-button henley in brushed cotton with a slightly ribbed placket — layers cleanly under an overshirt.", sizes:["S","M","L","XL"] },
  { id:"tee-05", category:"tshirts", name:"Gold Line Tee", price:2900, rating:4.7, reviews:19,
    image:"img/tee-05.svg",
    desc:"A minimal tee finished with a single fine gold hairline at the hem — quietly detailed, endlessly wearable.", sizes:["S","M","L","XL","XXL"] },
  { id:"tee-06", category:"tshirts", name:"Navy Stripe Tee", price:2700, rating:4.5, reviews:15,
    image:"img/tee-06.svg",
    desc:"A Breton-inspired striped tee in navy and ivory, woven from a durable cotton blend that holds its colour wash after wash.", sizes:["S","M","L","XL"] },
  { id:"tee-07", category:"tshirts", name:"Burgundy Crew Tee", price:2500, rating:4.6, reviews:17,
    image:"img/tee-07.svg",
    desc:"A rich burgundy crew tee in soft-washed cotton, cut with a clean crew neck and straight hem.", sizes:["S","M","L","XL","XXL"] },

  // ---------------- WALLETS ----------------
  { id:"wal-01", category:"wallets", name:"Bifold Leather Wallet", price:4200, badge:"Bestseller", rating:4.9, reviews:66,
    image:"img/wal-01.svg",
    desc:"Full-grain leather bifold with six card slots, two bill compartments, and a hand-burnished edge finish.", tags:["Bestseller"] },
  { id:"wal-02", category:"wallets", name:"Slim Card Holder", price:2600, rating:4.8, reviews:49,
    image:"img/wal-02.svg",
    desc:"A pared-back card holder in vegetable-tanned leather, built to slip flat into a front pocket. Four card slots." },
  { id:"wal-03", category:"wallets", name:"Trifold Heritage Wallet", price:4800, rating:4.7, reviews:22,
    image:"img/wal-03.svg",
    desc:"A structured trifold in chestnut leather with a coin pocket, ID window, and eight card slots." },
  { id:"wal-04", category:"wallets", name:"Gold Line Bifold", price:4500, badge:"New", rating:4.8, reviews:14,
    image:"img/wal-04.svg",
    desc:"Our signature bifold finished with a debossed gold hairline along the spine — understated and built to age well." },
  { id:"wal-05", category:"wallets", name:"Zip Travel Wallet", price:5200, rating:4.6, reviews:18,
    image:"img/wal-05.svg",
    desc:"A zip-around travel wallet with a passport sleeve, boarding-pass pocket, and eight card slots." },
  { id:"wal-06", category:"wallets", name:"Money Clip Wallet", price:3400, rating:4.7, reviews:20,
    image:"img/wal-06.svg",
    desc:"A slim front-pocket wallet with an integrated stainless money clip and three card slots." },
  { id:"wal-07", category:"wallets", name:"Cardholder & Keychain Set", price:3900, oldPrice:4600, badge:"Sale", rating:4.8, reviews:26,
    image:"img/wal-07.svg",
    desc:"A matched set: a slim leather cardholder and a hand-stitched leather keychain fob, boxed together." },
];

const CATEGORY_META = {
  caps:     { label:"Caps",     tagline:"Structured and unstructured caps in premium cottons and wools." },
  watches:  { label:"Watches",  tagline:"Automatic, chronograph and quartz timepieces for every occasion." },
  perfumes: { label:"Perfumes", tagline:"Layered, long-lasting fragrances in 100ml Eau de Parfum and Eau de Toilette." },
  tshirts:  { label:"T-Shirts", tagline:"Heavyweight cotton tees and henleys, cut for a clean, modern fit." },
  wallets:  { label:"Wallets",  tagline:"Full-grain and vegetable-tanned leather goods, built to age well." },
};

function formatPKR(n){
  return "Rs. " + n.toLocaleString("en-PK");
}

/* ==========================================================================
   Derived review data
   Products with no live review count get a stable, realistic count and a
   matching list of reviews (different names) for the product detail page.
   ========================================================================== */

var REVIEW_FIRST = [
  "Ahmed","Usman","Hamza","Bilal","Ali","Hassan","Omar","Zain","Farhan",
  "Salman","Danish","Imran","Adnan","Raza","Shahid","Taha","Murtaza",
  "Waleed","Taimoor","Shehryar","Adeel","Kamran","Junaid","Faisal",
  "Haris","Shaheer","Zubair","Noman"
];
var REVIEW_INITIALS = ["R.","K.","M.","H.","S.","Z.","F.","A.","B.","Q.","T.","V.","N."];
var REVIEW_TEXTS = [
  "Absolutely love this product. The quality exceeded my expectations and it looks even better in person.",
  "Great value for money. Build quality is solid and delivery was fast.",
  "Exactly as described in the listing. Would happily order again.",
  "Beautiful craftsmanship. Very happy with this purchase.",
  "The quality feels premium and the packaging was neat. Highly recommended.",
  "Worth every rupee. Fits perfectly and looks classy.",
  "Very impressed with the finish and attention to detail.",
  "Comfortable and durable — I've been using it almost every day.",
  "Seller was responsive and the delivery was quick. Top-tier product.",
  "Looks even better in real life than in the photos.",
  "My third order from Gentify Essentials and they never disappoint.",
  "Excellent quality for the price. Will definitely buy again.",
  "Understated design that gets compliments whenever I wear it.",
  "Solid purchase. The materials feel premium and long-lasting.",
  "Great fit and the colour is exactly as shown in the picture.",
  "Impressive quality all round — a very satisfied customer.",
  "Fast delivery and a premium feel. Five stars from me.",
  "Very happy with the craftsmanship. Well worth recommending.",
  "Quality product with a smooth ordering experience from start to finish.",
  "Sturdy, stylish and worth the money. No complaints at all."
];
var REVIEW_RATINGS = [5,5,5,5,5,5,5,4,5,4,5,5,4,5,5];

function productSeed(str) {
  var h = 2166136261;
  if (!str) str = "product";
  for (var i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function productReviewCount(p) {
  if (p && p.reviews && Number(p.reviews) > 0) return Number(p.reviews);
  return 14 + (productSeed(p && p.id ? String(p.id) : "") % 27);
}

function productReviews(p) {
  var count = productReviewCount(p);
  var seed = productSeed(p && p.id ? String(p.id) : "");
  var used = {};
  var out = [];
  for (var i = 0; i < count; i++) {
    var name;
    var tri = 0;
    do {
      var fi = (seed + i * 5 + tri) % REVIEW_FIRST.length;
      var ii = (seed + i * 11 + tri) % REVIEW_INITIALS.length;
      name = REVIEW_FIRST[fi] + " " + REVIEW_INITIALS[ii];
      tri++;
    } while (used[name]);
    used[name] = true;
    out.push({
      name: name,
      rating: REVIEW_RATINGS[(seed + i * 3) % REVIEW_RATINGS.length],
      text: REVIEW_TEXTS[(seed + i * 7) % REVIEW_TEXTS.length]
    });
  }
  return out;
}
