(function () {
  // ---- Config: replace these ----
  var FORM_ENDPOINT = "";            // e.g. "https://formspree.io/f/xxxxxxx"
  // -------------------------------

  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lang = "en";
  // Languages other than English/Kannada use Google Website Translator (machine translation of our English text)
  var GT = [["hi","हिन्दी (Hindi)"],["ta","தமிழ் (Tamil)"],["te","తెలుగు (Telugu)"],["ml","മലയാളം (Malayalam)"],["mr","मराठी (Marathi)"],["bn","বাংলা (Bengali)"],["gu","ગુજરાતી (Gujarati)"],["pa","ਪੰਜਾਬੀ (Punjabi)"],["or","ଓଡ଼ିଆ (Odia)"],["as","অসমীয়া (Assamese)"],["ur","اردو (Urdu)"],["ne","नेपाली (Nepali)"],["sa","संस्कृतम् (Sanskrit)"],["gom","कोंकणी (Konkani)"],["mai","मैथिली (Maithili)"],["doi","डोगरी (Dogri)"],["sd","سنڌي (Sindhi)"],["brx","बड़ो (Bodo)"],["sat","ᱥᱟᱱᱛᱟᱲᱤ (Santali)"],["mni-Mtei","ꯃꯩꯇꯩꯂꯣꯟ (Meiteilon)"],["ks","کٲشُر (Kashmiri)"]];
  function gtCode() { var m = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([^;]+)/); return m ? decodeURIComponent(m[1]) : ""; }
  function gtSet(code) { var v = "/en/" + code, h = location.hostname; document.cookie = "googtrans=" + v + ";path=/"; if (h.indexOf(".") > 0) document.cookie = "googtrans=" + v + ";path=/;domain=" + h; }
  function gtClear() { var h = location.hostname, past = "expires=Thu, 01 Jan 1970 00:00:00 GMT"; document.cookie = "googtrans=;path=/;" + past; document.cookie = "googtrans=;path=/;domain=" + h + ";" + past; }
  var gt = gtCode();
  var t = function (k) { return (window.I18N[lang] && window.I18N[lang][k]) || window.I18N.en[k] || k; };
  var esc = function (s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };

  // "*accent*" markers -> <em>; with data-split, every word becomes its own span for scroll-lighting
  function rich(str, split) {
    var parts = str.split("*"), out = "";
    parts.forEach(function (seg, i) {
      var acc = i % 2 === 1;
      if (split) {
        seg.split(/\s+/).filter(Boolean).forEach(function (w) {
          out += '<span class="w' + (acc ? " acc" : "") + '">' + esc(w) + "</span> ";
        });
      } else {
        out += acc ? "<em>" + esc(seg) + "</em>" : esc(seg);
      }
    });
    return out;
  }

  function apply() {
    document.documentElement.lang = lang;
    document.title = t(document.body.dataset.title || "doc.title");
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.dataset.i18n);
      if (el.hasAttribute("data-rich")) el.innerHTML = rich(v, el.hasAttribute("data-split") && !gt);
      else el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    var sel = document.getElementById("lang-select");
    if (sel) {
      var og = document.getElementById("lang-ours"), oa = document.getElementById("lang-auto");
      if (og) og.label = t("lang.ours"); if (oa) oa.label = t("lang.auto");
      sel.value = gt || lang;
    }
    lightWords();
  }
  function setLang(l) {
    lang = l;
    try { localStorage.setItem("rjp-lang", l); } catch (e) {}
    apply();
  }

  // scroll-lit statement words
  function lightWords() {
    var vh = window.innerHeight;
    document.querySelectorAll("[data-split]").forEach(function (el) {
      var words = el.querySelectorAll(".w"), r = el.getBoundingClientRect();
      var p = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.5 + r.height * 0.6)));
      var n = words.length;
      words.forEach(function (w, i) { w.classList.toggle("lit", i < p * n + 0.5); });
    });
  }

  try { var saved = localStorage.getItem("rjp-lang"); if (saved === "kn" || saved === "en") lang = saved; } catch (e) {}
  if (gt) lang = "en"; // Google translates our English text
  (function buildLangMenu() {
    var sel = document.getElementById("lang-select");
    if (!sel) return;
    var og = document.getElementById("lang-ours"), oa = document.getElementById("lang-auto");
    og.innerHTML = '<option value="en">English</option><option value="kn">ಕನ್ನಡ</option>';
    oa.innerHTML = GT.map(function (c) { return '<option value="' + c[0] + '">' + c[1] + "</option>"; }).join("");
    sel.addEventListener("change", function () {
      var v = sel.value;
      if (v === "en" || v === "kn") {
        var had = !!gtCode();
        gtClear(); setLang(v);
        if (had) location.reload();
      } else {
        try { localStorage.setItem("rjp-lang", "en"); } catch (e) {}
        gtSet(v); location.reload();
      }
    });
  })();
  apply();
  if (gt) {
    window.gtInit = function () {
      new google.translate.TranslateElement({ pageLanguage: "en", includedLanguages: GT.map(function (c) { return c[0]; }).join(","), autoDisplay: false }, "gt-el");
    };
    var gs = document.createElement("script");
    gs.src = "https://translate.google.com/translate_a/element.js?cb=gtInit";
    document.head.appendChild(gs);
  }

  // Ashoka-chakra spokes
  function spokes(id, r1, r2) {
    var g = document.getElementById(id);
    if (!g) return;
    var s = "";
    for (var i = 0; i < 24; i++) {
      var a = (i * 15) * Math.PI / 180;
      s += '<line x1="' + (r1 * Math.cos(a)).toFixed(2) + '" y1="' + (r1 * Math.sin(a)).toFixed(2) +
           '" x2="' + (r2 * Math.cos(a)).toFixed(2) + '" y2="' + (r2 * Math.sin(a)).toFixed(2) + '"/>';
    }
    g.innerHTML = s;
  }
  spokes("spokes", 14, 92);
  spokes("spokes2", 12, 92);

  // smooth scrolling (Lenis) with graceful fallback
  var lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.1 });
    (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(performance.now());
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute("href") === "#") return;
    var target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -70 });
    else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", a.getAttribute("href"));
  });

  // mobile menu
  var menuBtn = document.getElementById("menu-btn"), links = document.getElementById("links");
  if (menuBtn && links) {
    menuBtn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function () { links.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); });
  }

  // flag panel: background goes orange -> white -> green as you scroll through it
  var pin = document.getElementById("vision");
  function pinProgress() {
    if (!pin) return;
    var r = pin.getBoundingClientRect(), total = r.height - window.innerHeight;
    var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    pin.style.setProperty("--p", p.toFixed(3));
  }

  // header solid + progress bar + word lighting
  var hdr = document.getElementById("hdr"), bar = document.getElementById("progress");
  function onScroll() {
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
    if (hdr) hdr.classList.toggle("solid", h.scrollTop > 40);
    pinProgress();
    lightWords();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", lightWords);
  onScroll();


  // flag video: keep it still (poster only) for reduced motion or Data Saver
  (function () {
    var vids = document.querySelectorAll(".bg-video");
    var saver = navigator.connection && navigator.connection.saveData;
    if (!vids.length || !(reduce || saver)) return;
    vids.forEach(function (v) {
      v.pause(); v.removeAttribute("autoplay");
      v.querySelectorAll("source").forEach(function (src) { src.remove(); });
      v.load();
    });
  })();

  // hero glow follows the cursor
  var hero = document.getElementById("hero");
  if (hero) hero.addEventListener("pointermove", function (e) {
    var r = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", (e.clientX - r.left) + "px");
    hero.style.setProperty("--my", (e.clientY - r.top) + "px");
  });

  // stagger reveals inside grids
  document.querySelectorAll(".tiles, .pledges, .cmp, .mosaic").forEach(function (g) {
    Array.prototype.forEach.call(g.querySelectorAll(".reveal"), function (el, i) { el.style.setProperty("--d", (i * 0.09) + "s"); });
  });

  // count-up numbers
  function countUp(el) {
    var end = parseInt(el.dataset.count, 10);
    if (reduce || end === 0) { el.textContent = end; return; }
    var t0 = null;
    setTimeout(function () { el.textContent = end; }, 1700); // fallback if animation frames are paused
    (function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  // scroll reveal
  var pending = Array.prototype.slice.call(document.querySelectorAll(".reveal, .counters"));
  function reveal(el) {
    el.classList.add("in");
    el.querySelectorAll("[data-count]").forEach(countUp);
    pending = pending.filter(function (x) { return x !== el; });
  }
  // IntersectionObserver only fires when an element crosses the viewport, so anything skipped by an
  // instant jump (e.g. landing on #join) is revealed by this sweep of elements already scrolled past.
  function sweepPassed() {
    pending.slice().forEach(function (el) { if (el.getBoundingClientRect().bottom < 0) reveal(el); });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        reveal(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    pending.forEach(function (el) { io.observe(el); });
    window.addEventListener("scroll", sweepPassed, { passive: true });
    window.addEventListener("hashchange", sweepPassed);
    window.addEventListener("load", function () { [100, 500, 1200].forEach(function (ms) { setTimeout(sweepPassed, ms); }); });
    sweepPassed();
  } else {
    pending.slice().forEach(reveal);
    document.querySelectorAll("[data-count]").forEach(function (n) { n.textContent = n.dataset.count; });
  }

  // join form
  var form = document.getElementById("join-form"), msg = document.getElementById("form-msg");
  function show(key, cls) { msg.className = cls; msg.dataset.i18n = key; msg.textContent = t(key); }
  if (form && msg) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = new FormData(form);
    if (d.get("website")) return; // honeypot
    var name = (d.get("name") || "").trim(), phone = (d.get("phone") || "").trim(), email = (d.get("email") || "").trim();
    if (!name || (!phone && !email)) return show("f.invalid", "err");
    if (!FORM_ENDPOINT) return show("f.notset", "err");
    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true; show("f.sending", "");
    fetch(FORM_ENDPOINT, { method: "POST", body: d, headers: { Accept: "application/json" } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); show("f.ok", "ok"); })
      .catch(function () { show("f.err", "err"); })
      .finally(function () { btn.disabled = false; });
  });
})();
