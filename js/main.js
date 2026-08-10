/* ==========================================================================
   ZAMEEL & ASMIYA — WEDDING INVITATION
   Vanilla JS (ES6). All dynamic content is rendered from WEDDING_CONFIG
   (see js/config.js) so this file never needs to change between projects.
   ========================================================================== */

(() => {
  "use strict";

  const cfg = window.WEDDING_CONFIG;
  if (!cfg) { console.error("WEDDING_CONFIG not found — check config.js is loaded first."); return; }

  /* ------------------------------------------------------------------ */
  /* 1. RENDER CONTENT FROM CONFIG                                       */
  /* ------------------------------------------------------------------ */
  function renderContent() {
    document.title = cfg.meta.pageTitle;

    // Hero
    // Bodoni's own capitals are the decorative element here, so the
    // couple's names render as plain text (no script swash initial).
    setText("[data-bind='hero-bride-name']", cfg.couple.brideFirstName);
    setText("[data-bind='hero-groom-name']", cfg.couple.groomFirstName);
    setText("[data-bind='hero-date']", cfg.wedding.dateDisplay);
    setText("[data-bind='hero-venue']", `${cfg.wedding.venueName}, ${cfg.wedding.venueCity}`);

    // Opening overlay
    setText("[data-bind='open-bride-name']", cfg.couple.brideFirstName);
    setText("[data-bind='open-groom-name']", cfg.couple.groomFirstName);

    // Bismillah
    setText("[data-bind='bismillah-arabic']", cfg.invitation.bismillahArabic);
    setText("[data-bind='bismillah-l1']", cfg.invitation.bismillahLine1);
    setText("[data-bind='bismillah-l2']", cfg.invitation.bismillahLine2);
    setText("[data-bind='bismillah-l3']", cfg.invitation.bismillahLine3);

    // Invitation message
    setText("[data-bind='invitation-message']", cfg.invitation.message);
    setText("[data-bind='dua-translit']", cfg.invitation.duaArabicTransliteration);
    setText("[data-bind='dua-translation']", `"${cfg.invitation.duaTranslation}"`);

    // Bride
    setText("[data-bind='bride-initial']", cfg.couple.bride.fullName.charAt(0).toUpperCase());
    setText("[data-bind='bride-name']", cfg.couple.bride.fullName);
    setText("[data-bind='bride-family']", cfg.couple.bride.family);
    setText("[data-bind='bride-father']", cfg.couple.bride.father);
    setText("[data-bind='bride-mother']", cfg.couple.bride.mother);
    setText("[data-bind='bride-address']", `${cfg.couple.bride.house}, ${cfg.couple.bride.po}`);
    setText("[data-bind='bride-parents']", `D/o ${cfg.couple.bride.father} & ${cfg.couple.bride.mother}`);

    // Groom
    setText("[data-bind='groom-initial']", cfg.couple.groom.fullName.charAt(0).toUpperCase());
    setText("[data-bind='groom-name']", cfg.couple.groom.fullName);
    setText("[data-bind='groom-family']", cfg.couple.groom.family);
    setText("[data-bind='groom-father']", cfg.couple.groom.father);
    setText("[data-bind='groom-mother']", cfg.couple.groom.mother);
    setText("[data-bind='groom-address']", `${cfg.couple.groom.house}, ${cfg.couple.groom.po}`);
    setText("[data-bind='groom-parents']", `S/o ${cfg.couple.groom.father} & ${cfg.couple.groom.mother}`);

    // Wedding details
    setText("[data-bind='detail-date']", cfg.wedding.dateDisplay);
    setText("[data-bind='detail-day']", cfg.wedding.dayDisplay);
    setText("[data-bind='detail-hijri']", cfg.wedding.hijriDate);
    setText("[data-bind='detail-time']", cfg.wedding.timeDisplay);
    setText("[data-bind='detail-venue']", cfg.wedding.venueName);
    setText("[data-bind='detail-venue-sub']", `${cfg.wedding.venueCity}, ${cfg.wedding.venueState}`);

    // Venue section
    setText("[data-bind='venue-name']", cfg.wedding.venueName);
    setText("[data-bind='venue-address']", cfg.wedding.fullAddress);
    const mapsBtn = document.querySelector("[data-bind='venue-directions']");
    if (mapsBtn) mapsBtn.href = cfg.venue.directionsUrl;
    const mapIframe = document.querySelector("[data-bind='venue-map-embed']");
    if (mapIframe) mapIframe.src = cfg.venue.mapsEmbedUrl;

    // Thank you
    setText("[data-bind='thankyou-heading']", cfg.thankYou.heading);
    setText("[data-bind='thankyou-message']", cfg.thankYou.message);
    setText("[data-bind='thankyou-blessing']", cfg.thankYou.blessing);

    // Footer
    setText("[data-bind='footer-line']", cfg.footer.line);
    setText("[data-bind='footer-couple']", cfg.footer.couplePlaceholder);
    const groomInitial = cfg.couple.groomFirstName.charAt(0).toUpperCase();
    const brideInitial = cfg.couple.brideFirstName.charAt(0).toUpperCase();
    setText("[data-bind='footer-monogram']", `${groomInitial} & ${brideInitial}`);

    // Music
    const audio = document.querySelector("#bg-music");
    if (audio) audio.src = cfg.music.src;

    // Optional soft full-bleed hero background artwork.
    // Background image itself is set purely in CSS (with a media query that
    // swaps to the mobile crop below 768px) so it stays responsive without
    // JS; this just respects the "" opt-out and fades it in.
    const heroBgLayer = document.querySelector(".hero__bg-image");
    if (heroBgLayer && cfg.illustrations.heroBackground) {
      heroBgLayer.classList.add("is-visible");
    }

    // RSVP close date
    const rsvpKicker = document.querySelector("[data-bind='rsvp-close-date']");
    if (rsvpKicker && cfg.rsvp && cfg.rsvp.closeDate) {
      rsvpKicker.textContent = `Kindly Respond By ${cfg.rsvp.closeDate}`;
    }
  }

  function setText(sel, val) {
    document.querySelectorAll(sel).forEach(el => { el.textContent = val; });
  }
  function setImg(sel, src, alt) {
    document.querySelectorAll(sel).forEach(el => { el.src = src; if (alt) el.alt = alt; });
  }
  function setList(sel, arr) {
    document.querySelectorAll(sel).forEach(el => {
      el.innerHTML = arr.map(item => `<p>${item}</p>`).join("");
    });
  }
  // Escapes text for safe innerHTML insertion (names come from our own
  // config, but this keeps setSwashName safe regardless).
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }
  // Renders a name with the first letter of every word wrapped in
  // .letter-swash, so it picks up the flowing script capital styled in
  // css (--f-swash) while the rest of the name stays in the elegant
  // italic serif — matching the "big decorative initial" look used on
  // formal wedding invitations.
  function setSwashName(sel, val) {
    const html = String(val)
      .split(" ")
      .map(word => {
        if (!word) return word;
        const first = escapeHTML(word.charAt(0));
        const rest = escapeHTML(word.slice(1));
        return `<span class="letter-swash">${first}</span>${rest}`;
      })
      .join(" ");
    document.querySelectorAll(sel).forEach(el => { el.innerHTML = html; });
  }

  /* ------------------------------------------------------------------ */
  /* 2. OPENING ANIMATION                                                 */
  /* ------------------------------------------------------------------ */
  function initOpening() {
    const opening = document.getElementById("opening");
    const openBtn = document.getElementById("open-invitation-btn");
    const site = document.getElementById("site");
    const audio = document.getElementById("bg-music");

    if (!opening || !openBtn) return;

    openBtn.addEventListener("click", () => {
      opening.classList.add("opening--unfold");

      // try to start music (subject to browser autoplay policy)
      if (audio) {
        audio.play().then(() => {
          setMusicPlayingState(true);
        }).catch(() => {
          // Autoplay blocked — the floating button remains available to start manually.
          setMusicPlayingState(false);
        });
      }

      window.setTimeout(() => {
        opening.classList.add("opening--fading");
        site.classList.add("site--visible");
        document.body.style.overflow = "";
        // Kick off the staggered hero entrance (bismillah/eyebrow → names →
        // date/venue → scroll indicator) right as the site becomes visible.
        const hero = document.getElementById("hero");
        if (hero) hero.classList.add("hero--entrance");
      }, 750);

      window.setTimeout(() => {
        opening.classList.add("opening--hidden");
      }, 1900);
    }, { once: true });

    // lock scroll while the opening sequence plays
    document.body.style.overflow = "hidden";
  }

  /* ------------------------------------------------------------------ */
  /* 3. MUSIC PLAYER                                                      */
  /* ------------------------------------------------------------------ */
  function setMusicPlayingState(isPlaying) {
    const player = document.getElementById("music-player");
    if (!player) return;
    player.classList.toggle("is-playing", isPlaying);
    player.setAttribute("aria-pressed", String(isPlaying));
  }

  function initMusicPlayer() {
    const player = document.getElementById("music-player");
    const audio = document.getElementById("bg-music");
    if (!player || !audio) return;

    player.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().then(() => setMusicPlayingState(true)).catch(() => { });
      } else {
        audio.pause();
        setMusicPlayingState(false);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 4. SCROLL REVEAL                                                     */
  /* ------------------------------------------------------------------ */
  function initScrollReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || items.length === 0) {
      items.forEach(el => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });
    items.forEach(el => io.observe(el));
  }

  /* ------------------------------------------------------------------ */
  /* 5. COUNTDOWN                                                         */
  /* ------------------------------------------------------------------ */
  function initCountdown() {
    const el = document.getElementById("countdown");
    if (!el) return;
    const target = new Date(cfg.wedding.dateISO).getTime();

    const dEl = document.querySelector("[data-bind='cd-days']");
    const hEl = document.querySelector("[data-bind='cd-hours']");
    const mEl = document.querySelector("[data-bind='cd-mins']");
    const sEl = document.querySelector("[data-bind='cd-secs']");
    const endedEl = document.getElementById("countdown-ended");

    function tick() {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        el.style.display = "none";
        if (endedEl) endedEl.style.display = "block";
        clearInterval(timer);
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      updateUnit(dEl, days);
      updateUnit(hEl, hours);
      updateUnit(mEl, mins);
      updateUnit(sEl, secs);
    }
    function updateUnit(node, value) {
      if (!node) return;
      const str = String(value).padStart(2, "0");
      if (node.textContent !== str) node.textContent = str;
    }
    tick();
    const timer = setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------------ */
  /* 6. VENUE — copy address                                              */
  /* ------------------------------------------------------------------ */
  function initVenueActions() {
    const copyBtn = document.getElementById("copy-address-btn");
    if (!copyBtn) return;
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(cfg.wedding.fullAddress);
        const original = copyBtn.querySelector(".btn-text").textContent;
        copyBtn.querySelector(".btn-text").textContent = "Copied!";
        window.setTimeout(() => { copyBtn.querySelector(".btn-text").textContent = original; }, 1800);
      } catch (e) {
        window.prompt("Copy the address below:", cfg.wedding.fullAddress);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 7. RSVP FORM                                                         */
  /* ------------------------------------------------------------------ */
  /*
     Submits to the Google Apps Script Web App URL configured in
     js/rsvp-config.js (window.RSVP_CONFIG.scriptURL). See
     google-apps-script.js + README.md for the backend setup.

     If no scriptURL is configured, the form is disabled up front and
     shows "RSVP is currently unavailable." rather than throwing a
     JS error or silently pretending to succeed.
  */
  function initRSVP() {
    const form = document.getElementById("rsvp-form");
    if (!form) return;

    const submitBtn = form.querySelector(".rsvp-submit");
    const successPopup = document.getElementById("rsvp-success");
    const errorPopup = document.getElementById("rsvp-error");
    const errorMessageEl = errorPopup ? errorPopup.querySelector("[data-bind='rsvp-error-message']") : null;
    const unavailableNotice = document.getElementById("rsvp-unavailable");

    const scriptURL = window.RSVP_CONFIG && window.RSVP_CONFIG.scriptURL
      ? window.RSVP_CONFIG.scriptURL.trim()
      : "";
    const isConfigured = Boolean(scriptURL);

    if (!isConfigured) {
      // No backend configured — disable the form instead of failing silently.
      Array.from(form.elements).forEach(el => { el.disabled = true; });
      if (unavailableNotice) unavailableNotice.hidden = false;
      return;
    }

    let isSubmitting = false;

    function closePopups() {
      [successPopup, errorPopup].forEach(p => p && p.classList.remove("is-active"));
    }
    document.querySelectorAll("[data-close-popup]").forEach(btn => {
      btn.addEventListener("click", closePopups);
    });
    [successPopup, errorPopup].forEach(popup => {
      if (!popup) return;
      popup.addEventListener("click", (e) => { if (e.target === popup) closePopups(); });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if ((successPopup && successPopup.classList.contains("is-active")) ||
        (errorPopup && errorPopup.classList.contains("is-active"))) {
        closePopups();
      }
    });

    function showError(message) {
      if (errorMessageEl && message) errorMessageEl.textContent = message;
      if (errorPopup) errorPopup.classList.add("is-active");
    }

    function setLoading(loading) {
      if (!submitBtn) return;
      submitBtn.classList.toggle("is-loading", loading);
      submitBtn.disabled = loading;
    }

    /** Validates the form; returns an array of human-readable error messages. */
    function validate() {
      const errors = [];
      const name = form.fullName.value.trim();
      const mobile = form.mobile.value.trim();
      const guests = Number(form.guests.value);

      if (!name) errors.push("Please enter your full name.");
      // Accepts optional leading + and 7–15 digits (covers most international formats).
      if (!mobile) {
        errors.push("Please enter your mobile number.");
      } else if (!/^\+?[0-9\s-]{7,16}$/.test(mobile)) {
        errors.push("Please enter a valid mobile number.");
      }
      if (!guests || guests < 1 || guests > 10) {
        errors.push("Number of guests must be between 1 and 10.");
      }
      const email = form.email.value.trim();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Please enter a valid email address, or leave it blank.");
      }
      return errors;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (isSubmitting) return; // guard against double-clicks / double-submits

      const errors = validate();
      if (errors.length) {
        showError(errors[0]);
        return;
      }

      const payload = {
        fullName: form.fullName.value.trim(),
        mobile: form.mobile.value.trim(),
        email: form.email.value.trim(),
        side: form.side.value,
        attending: form.attending.value,
        guests: form.guests.value,
        message: form.message.value.trim()
      };

      isSubmitting = true;
      setLoading(true);

      try {
        // Sent as text/plain to avoid a CORS preflight (OPTIONS) request,
        // which Google Apps Script web apps do not handle. The Apps Script
        // side still parses this as JSON via e.postData.contents.
        const res = await fetch(scriptURL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Network response was not ok.");

        const result = await res.json();
        if (result.status !== "success") {
          throw new Error(result.message || "The RSVP could not be saved.");
        }

        form.reset();
        if (successPopup) successPopup.classList.add("is-active");
      } catch (err) {
        showError("We couldn't submit your RSVP. Please check your connection and try again.");
      } finally {
        isSubmitting = false;
        setLoading(false);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 8. AMBIENT PARTICLES (hero)                                          */
  /* ------------------------------------------------------------------ */
  function initParticles() {
    const field = document.querySelector(".ambient-particles");
    if (!field) return;
    const count = window.innerWidth < 640 ? 8 : 16;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.style.left = `${Math.random() * 100}%`;
      p.style.bottom = `${Math.random() * 30}%`;
      p.style.animationDuration = `${10 + Math.random() * 10}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      p.style.opacity = String(0.2 + Math.random() * 0.3);
      field.appendChild(p);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 9. MOBILE NAV DOT (smooth-scroll safe area) — none needed currently  */
  /* ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ */
  /* INIT                                                                 */
  /* ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    renderContent();
    initOpening();
    initMusicPlayer();
    initScrollReveal();
    initCountdown();
    initVenueActions();
    initRSVP();
    initParticles();
  });

})();

/* ========================================================================== */
/*  INTERACTIVE SECTION EFFECTS  (appended)                                   */
/* ========================================================================== */
(() => {
  "use strict";

  /* ---------------------------------------------------------------------- */
  /* UTILITY                                                                 */
  /* ---------------------------------------------------------------------- */
  function rand(min, max) { return min + Math.random() * (max - min); }
  function isMobile() { return window.innerWidth < 768; }

  /* Debounce used for resize listeners */
  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  /* ---------------------------------------------------------------------- */
  /* 1. HERO — mouse-tracking spotlight (touch-tracking on mobile)           */
  /* ---------------------------------------------------------------------- */
  function initHeroSpotlight() {
    const hero = document.getElementById("hero");
    const spotlight = hero && hero.querySelector(".hero__spotlight");
    if (!hero || !spotlight) return;

    function setSpot(clientX, clientY) {
      const rect = hero.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((clientY - rect.top) / rect.height * 100).toFixed(1);
      spotlight.style.setProperty("--mx", x + "%");
      spotlight.style.setProperty("--my", y + "%");
    }

    if (isMobile()) {
      // Touch a finger to the hero and the gold spotlight glow follows it.
      const onTouch = (e) => {
        const t = e.touches[0];
        if (t) setSpot(t.clientX, t.clientY);
      };
      hero.addEventListener("touchstart", onTouch, { passive: true });
      hero.addEventListener("touchmove", onTouch, { passive: true });
    } else {
      hero.addEventListener("mousemove", (e) => setSpot(e.clientX, e.clientY));
    }
  }

  /* ---------------------------------------------------------------------- */
  /* 2. BISMILLAH — scroll-based mandala parallax scale                     */
  /* ---------------------------------------------------------------------- */
  function initBismillahParallax() {
    const section = document.getElementById("bismillah");
    const mandala = section && section.querySelector(".bismillah__mandala-bg");
    if (!section || !mandala) return;

    function onScroll() {
      const rect = section.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      // Map -1 → 1 viewport progress to scale 0.88 → 1.12
      const prog = Math.max(-1, Math.min(1, -center / (window.innerHeight * 0.6)));
      const scale = 1 + prog * 0.12;
      mandala.style.transform = `translate(-50%,-50%) scale(${scale.toFixed(3)})`;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------------------- */
  /* 3. INVITATION — starfield dots                                          */
  /* ---------------------------------------------------------------------- */
  function initInvitationStars() {
    const canvas = document.getElementById("invitation-stars");
    if (!canvas) return;
    const count = isMobile() ? 14 : 30;
    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      const size = rand(2, 5);
      star.className = "invitation__star";
      star.style.cssText = `
        left:${rand(0, 100)}%;
        top:${rand(0, 100)}%;
        width:${size}px;
        height:${size}px;
        --spd:${rand(3, 7).toFixed(1)}s;
        --delay:${rand(0, 5).toFixed(1)}s;
        --op:${rand(0.15, 0.4).toFixed(2)};
      `;
      canvas.appendChild(star);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* 4. COUPLE — floating petal particles                                    */
  /* ---------------------------------------------------------------------- */
  function initCouplePetals() {
    const canvas = document.getElementById("couple-petals");
    if (!canvas) return;
    const count = isMobile() ? 6 : 14;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      const size = rand(8, 18);
      p.className = "petal";
      p.style.cssText = `
        left:${rand(0, 100)}%;
        --sz:${size}px;
        --dur:${rand(10, 20).toFixed(1)}s;
        --delay:${rand(0, 12).toFixed(1)}s;
        --op:${rand(0.1, 0.22).toFixed(2)};
        --dx:${(Math.random() > 0.5 ? 1 : -1) * rand(30, 80).toFixed(0)}px;
        --rot:${rand(0, 360).toFixed(0)}deg;
      `;
      canvas.appendChild(p);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* 5. THANK YOU — rose petal rain                                          */
  /* ---------------------------------------------------------------------- */
  function initThankyouPetals() {
    const canvas = document.getElementById("ty-petals");
    if (!canvas) return;
    const symbols = ["✿", "❀", "✾", "⚘"];
    const count = isMobile() ? 8 : 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "ty-petal";
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.cssText = `
        left:${rand(0, 100)}%;
        --fs:${rand(10, 22).toFixed(0)}px;
        --dur:${rand(8, 16).toFixed(1)}s;
        --delay:${rand(0, 10).toFixed(1)}s;
        --op:${rand(0.12, 0.28).toFixed(2)};
        --dx:${(Math.random() > 0.5 ? 1 : -1) * rand(20, 70).toFixed(0)}px;
        color:rgba(200,169,90,0.6);
      `;
      canvas.appendChild(p);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* GLOBAL FLOATING FLOWERS — fixed full-screen decorative layer            */
  /* Same technique as the Hafnas & Hisham reference: small inline-SVG      */
  /* flower petals, recoloured to this project's gold/ivory palette. Each   */
  /* petal gets randomised size, position, duration and delay so the field  */
  /* feels naturally scattered rather than gridded.                        */
  /* ---------------------------------------------------------------------- */
  function initFloatingFlowers() {
    const container = document.getElementById("floating-flowers");
    if (!container) return;

    // Respect the user's motion preference — skip generating entirely.
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Gold / ivory tones only — keeps the existing colour palette intact.
    const colors = ["#D8BE7A", "#C8A95A", "#857A63"]; // gold-light, gold, muted-ink
    const w = window.innerWidth;
    // Desktop gets the full experience; tablet and mobile scale the count down.
    const PETAL_COUNT = w < 640 ? 6 : w < 1024 ? 9 : 14;

    function flowerSVG(color) {
      return `
        <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <g fill="${color}" opacity="0.8">
            <ellipse cx="20" cy="10" rx="6" ry="10"/>
            <ellipse cx="20" cy="10" rx="6" ry="10" transform="rotate(72 20 20)"/>
            <ellipse cx="20" cy="10" rx="6" ry="10" transform="rotate(144 20 20)"/>
            <ellipse cx="20" cy="10" rx="6" ry="10" transform="rotate(216 20 20)"/>
            <ellipse cx="20" cy="10" rx="6" ry="10" transform="rotate(288 20 20)"/>
            <circle cx="20" cy="20" r="4.5" fill="#FBF4E3"/>
          </g>
        </svg>`;
    }

    for (let i = 0; i < PETAL_COUNT; i++) {
      const petal = document.createElement("div");
      petal.className = "flower-petal";

      const size = rand(12, 26);            // 12–26px
      const left = rand(0, 100);             // 0–100%
      const duration = rand(16, 28);             // 16–28s per the brief
      const delay = -rand(0, duration);       // stagger start
      const opacity = rand(0.5, 0.85);
      const color = colors[Math.floor(Math.random() * colors.length)];

      petal.style.width = `${size.toFixed(0)}px`;
      petal.style.height = `${size.toFixed(0)}px`;
      petal.style.left = `${left.toFixed(1)}%`;
      petal.style.animationDuration = `${duration.toFixed(1)}s`;
      petal.style.animationDelay = `${delay.toFixed(1)}s`;
      petal.style.setProperty("--op", opacity.toFixed(2));
      petal.innerHTML = flowerSVG(color);

      container.appendChild(petal);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* 6. SECTION IN-VIEW — adds .in-view class for CSS-triggered effects     */
  /* ---------------------------------------------------------------------- */
  function initSectionInView() {
    const targets = document.querySelectorAll("#venue, #bismillah, #details, #rsvp, #thankyou");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(el => el.classList.add("in-view"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("in-view");
      });
    }, { threshold: 0.15 });
    targets.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------------------- */
  /* 7. 3D TILT — gentle parallax tilt on [data-tilt] cards                 */
  /* Desktop: follows the mouse. Mobile: follows a finger drag across the   */
  /* card, and a quick tap gives a soft bounce so the cards feel touchable. */
  /* ---------------------------------------------------------------------- */
  function initTilt() {
    const MAX_TILT = 6;  // degrees
    const MAX_LIFT = 18; // px translation
    const mobile = isMobile();

    document.querySelectorAll("[data-tilt]").forEach(card => {
      function applyTilt(clientX, clientY) {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (clientX - cx) / (rect.width / 2);  // -1 → 1
        const dy = (clientY - cy) / (rect.height / 2);  // -1 → 1
        const rotX = (-dy * MAX_TILT).toFixed(2);
        const rotY = (dx * MAX_TILT).toFixed(2);
        const shadow = `${-dx * 8}px ${-dy * 8 + MAX_LIFT}px 30px rgba(160,130,60,0.22)`;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
        card.style.boxShadow = shadow;
        card.style.transition = "transform 0.1s ease, box-shadow 0.1s ease";
      }
      function resetTilt() {
        card.style.transform = "";
        card.style.boxShadow = "";
        card.style.transition = "transform 0.5s var(--ease-soft,ease), box-shadow 0.5s var(--ease-soft,ease)";
      }

      if (mobile) {
        card.addEventListener("touchstart", (e) => {
          const t = e.touches[0];
          if (t) applyTilt(t.clientX, t.clientY);
        }, { passive: true });
        card.addEventListener("touchmove", (e) => {
          const t = e.touches[0];
          if (t) applyTilt(t.clientX, t.clientY);
        }, { passive: true });
        card.addEventListener("touchend", resetTilt);
        card.addEventListener("touchcancel", resetTilt);
      } else {
        card.addEventListener("mousemove", (e) => applyTilt(e.clientX, e.clientY));
        card.addEventListener("mouseleave", resetTilt);
      }
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 8. COUNTDOWN — flash highlight on number change                        */
  /* ---------------------------------------------------------------------- */
  function initCountdownFlash() {
    const numEls = document.querySelectorAll(".countdown__number");
    if (!numEls.length) return;

    // Observe text changes via MutationObserver
    numEls.forEach(el => {
      const mo = new MutationObserver(() => {
        el.classList.remove("flash");
        // Force reflow
        void el.offsetWidth;
        el.classList.add("flash");
      });
      mo.observe(el, { characterData: true, subtree: true, childList: true });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 9. VENUE — heading underline draw on section enter                     */
  /* ---------------------------------------------------------------------- */
  function initVenueUnderline() {
    // The .in-view class on #venue triggers the CSS width animation.
    // Nothing extra needed — handled by initSectionInView.
  }

  /* ---------------------------------------------------------------------- */
  /* 10. HERO NAMES — subtle parallax on scroll                             */
  /* ---------------------------------------------------------------------- */
  function initHeroParallax() {
    const names = document.querySelector(".hero__names");
    const crescent = document.querySelector(".hero__crescent");
    if (!names) return;

    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      const fac = Math.min(y / window.innerHeight, 1);
      names.style.transform = `translateY(${fac * 30}px)`;
      names.style.opacity = `${1 - fac * 1.4}`;
      if (crescent) crescent.style.transform = `translateX(-50%) translateY(${fac * -18}px)`;
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------- */
  /* INIT ALL                                                                */
  /* ---------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initFloatingFlowers();
    initHeroSpotlight();
    initHeroParallax();
    initBismillahParallax();
    initInvitationStars();
    initCouplePetals();
    initThankyouPetals();
    initSectionInView();
    initTilt();
    initCountdownFlash();
    initVenueUnderline();
  });

})();