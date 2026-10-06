(function () {
  // ---- Config: replace these ----
  var FORM_ENDPOINT = "";            // e.g. "https://formspree.io/f/xxxxxxx"
  var VIDEO_ID = "JQtcncVur8g";      // YouTube video id for the "Why RJP" section
  // -------------------------------

  var lang = "en";
  var t = function (k) { return (window.I18N[lang] && window.I18N[lang][k]) || window.I18N.en[k] || k; };

  function apply() {
    document.documentElement.lang = lang;
    document.title = t("doc.title");
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    document.querySelectorAll(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
  }
  function setLang(l) {
    lang = l;
    try { localStorage.setItem("rjp-lang", l); } catch (e) {}
    apply();
  }

  try { var saved = localStorage.getItem("rjp-lang"); if (saved === "kn" || saved === "en") lang = saved; } catch (e) {}
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.lang); });
  });
  apply();

  // mobile menu
  var menuBtn = document.getElementById("menu-btn"), links = document.getElementById("links");
  menuBtn.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", function () { links.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); });

  // Ashoka-chakra spokes (24)
  var spokes = document.getElementById("spokes");
  if (spokes) {
    var s = "";
    for (var i = 0; i < 24; i++) {
      var a = (i * 15) * Math.PI / 180;
      s += '<line x1="' + (14 * Math.cos(a)).toFixed(2) + '" y1="' + (14 * Math.sin(a)).toFixed(2) +
           '" x2="' + (92 * Math.cos(a)).toFixed(2) + '" y2="' + (92 * Math.sin(a)).toFixed(2) + '"/>';
    }
    spokes.innerHTML = s;
  }

  // header solid + scroll progress
  var hdr = document.getElementById("hdr"), bar = document.getElementById("progress");
  function onScroll() {
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
    hdr.classList.toggle("solid", h.scrollTop > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // hero cursor spotlight
  var hero = document.getElementById("hero");
  hero.addEventListener("pointermove", function (e) {
    var r = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", (e.clientX - r.left) + "px");
    hero.style.setProperty("--my", (e.clientY - r.top) + "px");
  });

  // stagger reveals inside grids
  document.querySelectorAll(".pgrid, .grid, .statgrid, .pledges, .cmp").forEach(function (g) {
    Array.prototype.forEach.call(g.querySelectorAll(".reveal"), function (el, i) { el.style.setProperty("--d", (i * 0.09) + "s"); });
  });

  // count-up numbers
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function countUp(el) {
    var end = parseInt(el.dataset.count, 10);
    if (reduce || end === 0) { el.textContent = end; return; }
    var t0 = null;
    (function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  // scroll reveal
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        var n = e.target.querySelector("[data-count]");
        if (n) countUp(n);
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll("[data-count]").forEach(function (n) { n.textContent = n.dataset.count; });
  }

  // video facade (loads YouTube only after click)
  var vb = document.getElementById("video-btn");
  vb.style.backgroundImage = "url(https://i.ytimg.com/vi/" + VIDEO_ID + "/hqdefault.jpg)";
  vb.addEventListener("click", function () {
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + VIDEO_ID + "?autoplay=1&rel=0";
    f.title = "Video";
    f.allow = "accelerometer; autoplay; encrypted-media; picture-in-picture";
    f.allowFullscreen = true;
    vb.replaceWith(f);
  });
  document.getElementById("video-link").href = "https://youtu.be/" + VIDEO_ID;

  // join form
  var form = document.getElementById("join-form"), msg = document.getElementById("form-msg");
  function show(key, cls) { msg.className = cls; msg.dataset.i18n = key; msg.textContent = t(key); }
  form.addEventListener("submit", function (e) {
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
