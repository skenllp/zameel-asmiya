/* ============================================================
   WEDDING CONFIGURATION
   ------------------------------------------------------------
   This is the single source of truth for the entire website.
   To reuse this template for a different couple, change ONLY
   the values below — nothing else in the codebase needs to
   change. Every page element is rendered from this object.
   ============================================================ */

window.WEDDING_CONFIG = {

  /* ---------- Meta / SEO ---------- */
  meta: {
    pageTitle: "Zameel Mohammed & Asmiya Sherin C.T | Wedding Invitation",
    description: "Wedding Invitation of Zameel Mohammed & Asmiya Sherin C.T — 23 August 2026, Palm Convention Centre Pulamanthole.",
    ogImage: "assets/images/og-image.jpg",
    siteUrl: "" // fill with the live URL once deployed
  },

  /* ---------- Couple ---------- */
  couple: {
    brideFirstName: "Asmiya Sherin C.T",
    groomFirstName: "Zameel Mohammed",
    bride: {
      fullName: "Asmiya Sherin C.T",
      family: "Cherengathody",
      father: "Azeez Cherengathody",
      mother: "Bushara",
      house: "Cherengathody (H)",
      po: "Punnakkad"
    },
    groom: {
      fullName: "Zameel Mohammed",
      family: "Poonthottathil",
      father: "Azeez",
      mother: "Rasiya",
      house: "Poonthottathil (H)",
      po: "Valapuram (PO)"
    }
  },

  /* ---------- Illustrations ----------
     Optional soft full-bleed hero backdrop photo/art. Lives directly under
     assets/images/ — set to "" to disable it. */
  illustrations: {
    heroBackground: "assets/images/hero-bg.jpg" // optional soft full-bleed hero backdrop; set to "" to disable
  },

  /* ---------- Wedding Details ---------- */
  wedding: {
    dateISO: "2026-08-23T10:00:00+05:30",
    dateDisplay: "23 August 2026",
    dayDisplay: "Sunday",
    hijriDate: "10 Rabi' ul-Awwal 1448 AH",
    timeDisplay: "10:00 AM",
    venueName: "Palm Convention Centre Pulamanthole",
    venueCity: "Malappuram",
    venueState: "Kerala",
    fullAddress: "Palm Convention Centre Pulamanthole, Malappuram, Kerala, India"
  },

  /* ---------- Venue / Map ---------- */
  venue: {
    lat: 10.9062988,
    lng: 76.1943129,
    mapsShareUrl: "https://www.google.com/maps/search/?api=1&query=Pulamanthole%2C+Kerala",
    mapsEmbedUrl: "https://www.google.com/maps?q=10.9062988,76.1943129&z=14&output=embed",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=10.9062988,76.1943129"
  },

  /* ---------- Invitation Text ---------- */
  invitation: {
    bismillahArabic: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    bismillahLine1: "IN THE NAME OF ALLAH",
    bismillahLine2: "THE MOST GRACIOUS",
    bismillahLine3: "THE MOST MERCIFUL",
    message: "With the blessings of Allah (سبحانه وتعالى), we cordially invite your esteemed presence and duas, along with your family and friends, to grace the joyous occasion of the wedding of our beloved daughter.",
    duaArabicTransliteration: "Allahumma barik lahuma wa barik 'alayhima wa ajma' baynahuma fi khayr.",
    duaTranslation: "O Allah, bless them, shower Your blessings upon them, and unite them in goodness."
  },

  /* ---------- Thank You ---------- */
  thankYou: {
    heading: "JazakAllahu Khair wa BarakAllahu Feek",
    message: "From the bottom of our hearts, thank you for being a part of our journey. Your presence, prayers and blessings mean the world to us as we begin this new chapter together.",
    blessing: "May Allah bless our union and grant us a home filled with love, mercy and peace."
  },

  /* ---------- Footer ---------- */
  footer: {
    line: "Made with ❤ for the celebration of love.",
    couplePlaceholder: "Zameel Mohammed & Asmiya Sherin C.T · 23.08.2026"
  },

  /* ---------- Music ---------- */
  music: {
    src: "assets/music/music.mp3",
    title: "Wedding Theme"
  },

  /* ---------- RSVP ----------
     The actual submission endpoint lives in js/rsvp-config.js (RSVP_CONFIG.scriptURL)
     so it can be swapped per-deployment without touching this file. See README.md
     "Configuring Google Sheets RSVP" for the full setup guide. */
  rsvp: {
    closeDate: "9 August 2026" // shown in the RSVP section kicker; keep in sync with the copy in index.html
  }
};
