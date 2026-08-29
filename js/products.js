/* ==========================================================================
   GENTIFY ESSENTIALS — product catalog
   Prices in PKR. Images are placeholder swatches (placehold.co) standing in
   for real product photography — swap the `image` URLs for real shots.
   ========================================================================== */

const PRODUCTS = [
  // ---------------- CAPS ----------------
  { id:"cap-01", category:"caps", name:"Navy Snapback", price:2200, oldPrice:2800, badge:"Sale", rating:4.8, reviews:64,
    image:"https://placehold.co/600x600/0B1F3A/D8BD84?font=playfair-display&text=Navy%0ASnapback",
    desc:"A structured six-panel snapback in brushed navy cotton twill with a tonal gold eyelet trim. Adjustable snap closure, curved peak.", tags:["Bestseller"] },
  { id:"cap-02", category:"caps", name:"Classic White Cap", price:1900, rating:4.9, reviews:88, badge:"Bestseller",
    image:"https://placehold.co/600x600/F6F2E9/0B1F3A?font=playfair-display&text=Classic%0AWhite+Cap",
    desc:"Our signature dad cap in heavyweight white cotton with a low profile crown and unstructured brim for an easy, worn-in fit." },
  { id:"cap-03", category:"caps", name:"Charcoal Wool Flatcap", price:3400, rating:4.7, reviews:31,
    image:"https://placehold.co/600x600/2B2B2B/F6F2E9?font=playfair-display&text=Wool%0AFlatcap",
    desc:"A tailored flatcap woven from Italian wool blend, lined in breathable cotton — built for cooler weather and a sharper silhouette." },
  { id:"cap-04", category:"caps", name:"Olive Field Cap", price:2100, rating:4.6, reviews:22,
    image:"https://placehold.co/600x600/4A5A3A/F6F2E9?font=playfair-display&text=Olive%0AField+Cap",
    desc:"Military-inspired field cap in washed olive cotton canvas with a soft brim and brass ventilation eyelets." },
  { id:"cap-05", category:"caps", name:"Gold Line Trucker", price:2500, badge:"New", rating:4.8, reviews:14,
    image:"https://placehold.co/600x600/16294A/B8923F?font=playfair-display&text=Gold+Line%0ATrucker",
    desc:"Mesh-back trucker cap with a foam front panel and a single embroidered gold hairline — breathable and built for daily rotation." },
  { id:"cap-06", category:"caps", name:"Burgundy Corduroy Cap", price:2300, rating:4.5, reviews:19,
    image:"https://placehold.co/600x600/5A2430/F6F2E9?font=playfair-display&text=Corduroy%0ACap",
    desc:"Wide-wale corduroy six-panel with a soft unstructured crown, finished with a leather strap-back closure." },
  { id:"cap-07", category:"caps", name:"Ivory Weekend Cap", price:2000, rating:4.7, reviews:27,
    image:"https://placehold.co/600x600/EFE8D8/0B1F3A?font=playfair-display&text=Weekend%0ACap",
    desc:"A relaxed twill cap in soft ivory, garment-washed for a lived-in texture and finished with tonal stitching." },

  // ---------------- WATCHES ----------------
  { id:"watch-01", category:"watches", name:"Heritage Chronograph", price:18500, oldPrice:22000, badge:"Sale", rating:4.9, reviews:52,
    image:"https://placehold.co/600x600/0B1F3A/D8BD84?font=playfair-display&text=Heritage%0AChronograph",
    desc:"A 42mm stainless case chronograph with sunburst navy dial, sapphire crystal, and a genuine leather strap. Water resistant to 5ATM.", tags:["Bestseller"] },
  { id:"watch-02", category:"watches", name:"Pilot Automatic", price:24900, badge:"Bestseller", rating:4.8, reviews:41,
    image:"https://placehold.co/600x600/232323/F6F2E9?font=playfair-display&text=Pilot%0AAutomatic",
    desc:"Automatic movement pilot-style watch with an oversized crown, luminous markers, and a rugged canvas NATO strap." },
  { id:"watch-03", category:"watches", name:"Gold Line Dress Watch", price:16900, rating:4.7, reviews:23,
    image:"https://placehold.co/600x600/16294A/B8923F?font=playfair-display&text=Dress%0AWatch",
    desc:"A slim 38mm dress watch with a champagne dial, gold-tone indices, and a hand-stitched brown leather strap." },
  { id:"watch-04", category:"watches", name:"Steel Diver 200m", price:21000, rating:4.8, reviews:35, badge:"New",
    image:"https://placehold.co/600x600/13324A/F6F2E9?font=playfair-display&text=Steel%0ADiver",
    desc:"A robust dive-ready watch with a unidirectional bezel, screw-down crown, and 200m water resistance on a steel bracelet." },
  { id:"watch-05", category:"watches", name:"Minimalist Mesh", price:13500, rating:4.6, reviews:18,
    image:"https://placehold.co/600x600/EFE8D8/0B1F3A?font=playfair-display&text=Minimalist%0AMesh",
    desc:"A clean-dial quartz watch with a slim case and a fine stainless mesh band — pairs equally well with tailoring or denim." },
  { id:"watch-06", category:"watches", name:"Field Explorer", price:19900, rating:4.7, reviews:20,
    image:"https://placehold.co/600x600/3A4A3A/F6F2E9?font=playfair-display&text=Field%0AExplorer",
    desc:"A durable field watch with a matte dial, olive nylon strap, and shock-resistant case built for daily wear outdoors." },
  { id:"watch-07", category:"watches", name:"Classic Two-Tone", price:23500, rating:4.9, reviews:29,
    image:"https://placehold.co/600x600/5A4A2A/F6F2E9?font=playfair-display&text=Two-Tone%0AClassic",
    desc:"A timeless two-tone bracelet watch pairing polished steel with warm gold accents on a jubilee-style band." },

  // ---------------- PERFUMES ----------------
  { id:"perf-01", category:"perfumes", name:"Noir Oud EDP", price:8900, badge:"Bestseller", rating:4.9, reviews:73,
    image:"https://placehold.co/600x600/0B1F3A/B8923F?font=playfair-display&text=Noir%0AOud",
    desc:"A deep, smoky oud fragrance layered with amber and dark musk. Eau de Parfum, 100ml, 8–10hr projection.", tags:["Bestseller"] },
  { id:"perf-02", category:"perfumes", name:"Vetiver Blanc", price:7400, rating:4.7, reviews:38,
    image:"https://placehold.co/600x600/EFE8D8/0B1F3A?font=playfair-display&text=Vetiver%0ABlanc",
    desc:"A crisp, green vetiver built on citrus top notes and a clean cedar base — a versatile daytime signature. 100ml EDT." },
  { id:"perf-03", category:"perfumes", name:"Amber & Tobacco", price:9600, oldPrice:11200, badge:"Sale", rating:4.8, reviews:29,
    image:"https://placehold.co/600x600/4A2A16/F6F2E9?font=playfair-display&text=Amber+%26amp;%0ATobacco",
    desc:"Warm tobacco leaf and honeyed amber wrapped around a base of sandalwood — rich enough for evening wear. 100ml EDP." },
  { id:"perf-04", category:"perfumes", name:"Bergamot Steel", price:6800, badge:"New", rating:4.6, reviews:16,
    image:"https://placehold.co/600x600/16294A/D8BD84?font=playfair-display&text=Bergamot%0ASteel",
    desc:"A sharp aquatic-citrus opening over a mineral, steel-cool base — built for warm days and long summers. 100ml EDT." },
  { id:"perf-05", category:"perfumes", name:"Leather & Sage", price:8200, rating:4.8, reviews:24,
    image:"https://placehold.co/600x600/2B2B2B/D8BD84?font=playfair-display&text=Leather%0A%26amp;+Sage",
    desc:"Supple leather accord balanced with clary sage and a soft vanilla drydown. A study in understated confidence. 100ml EDP." },
  { id:"perf-06", category:"perfumes", name:"Cedar & Citron", price:7000, rating:4.5, reviews:20,
    image:"https://placehold.co/600x600/3A4A3A/F6F2E9?font=playfair-display&text=Cedar+%26amp;%0ACitron",
    desc:"Bright Sicilian citron over dry cedarwood and a whisper of black pepper — a clean, confident everyday scent. 100ml EDT." },
  { id:"perf-07", category:"perfumes", name:"Midnight Spice", price:9200, rating:4.9, reviews:33,
    image:"https://placehold.co/600x600/241830/F6F2E9?font=playfair-display&text=Midnight%0ASpice",
    desc:"Cardamom and black pepper over a smoldering base of oud and dark chocolate — built for cold nights. 100ml EDP." },

  // ---------------- WALLETS ----------------
  { id:"wal-01", category:"wallets", name:"Bifold Leather Wallet", price:4200, badge:"Bestseller", rating:4.9, reviews:66,
    image:"https://placehold.co/600x600/2B2B2B/D8BD84?font=playfair-display&text=Bifold%0AWallet",
    desc:"Full-grain leather bifold with six card slots, two bill compartments, and a hand-burnished edge finish.", tags:["Bestseller"] },
  { id:"wal-02", category:"wallets", name:"Slim Card Holder", price:2600, rating:4.8, reviews:49,
    image:"https://placehold.co/600x600/0B1F3A/F6F2E9?font=playfair-display&text=Card%0AHolder",
    desc:"A pared-back card holder in vegetable-tanned leather, built to slip flat into a front pocket. Four card slots." },
  { id:"wal-03", category:"wallets", name:"Trifold Heritage Wallet", price:4800, rating:4.7, reviews:22,
    image:"https://placehold.co/600x600/4A2A16/F6F2E9?font=playfair-display&text=Trifold%0AWallet",
    desc:"A structured trifold in chestnut leather with a coin pocket, ID window, and eight card slots." },
  { id:"wal-04", category:"wallets", name:"Gold Line Bifold", price:4500, badge:"New", rating:4.8, reviews:14,
    image:"https://placehold.co/600x600/16294A/B8923F?font=playfair-display&text=Gold+Line%0ABifold",
    desc:"Our signature bifold finished with a debossed gold hairline along the spine — understated and built to age well." },
  { id:"wal-05", category:"wallets", name:"Zip Travel Wallet", price:5200, rating:4.6, reviews:18,
    image:"https://placehold.co/600x600/2B2B2B/F6F2E9?font=playfair-display&text=Travel%0AWallet",
    desc:"A zip-around travel wallet with a passport sleeve, boarding-pass pocket, and eight card slots." },
  { id:"wal-06", category:"wallets", name:"Money Clip Wallet", price:3400, rating:4.7, reviews:20,
    image:"https://placehold.co/600x600/5A2430/F6F2E9?font=playfair-display&text=Money+Clip%0AWallet",
    desc:"A slim front-pocket wallet with an integrated stainless money clip and three card slots." },
  { id:"wal-07", category:"wallets", name:"Cardholder & Keychain Set", price:3900, oldPrice:4600, badge:"Sale", rating:4.8, reviews:26,
    image:"https://placehold.co/600x600/3A4A3A/F6F2E9?font=playfair-display&text=Cardholder%0A++Keychain",
    desc:"A matched set: a slim leather cardholder and a hand-stitched leather keychain fob, boxed together." },
];

const CATEGORY_META = {
  caps:     { label:"Caps",     tagline:"Structured and unstructured caps in premium cottons and wools." },
  watches:  { label:"Watches",  tagline:"Automatic, chronograph and quartz timepieces for every occasion." },
  perfumes: { label:"Perfumes", tagline:"Layered, long-lasting fragrances in 100ml Eau de Parfum and Eau de Toilette." },
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
