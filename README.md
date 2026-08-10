# Wedding Invitation — Premium Muslim Wedding Website Template

A single-page, animated wedding invitation built with **pure HTML5, CSS3, and
vanilla JavaScript** (no frameworks, no build step). It includes an opening
animation, hero, Bismillah, invitation message, bride & groom bios, wedding
details, a live countdown, an embedded Google Map, an RSVP form that saves to
a Google Sheet, a thank-you note, and a floating music player.

Everything on the page is driven from **one config file** —
`js/config.js` — so you can reuse this template for a new couple without
touching the HTML, CSS, or JS.

```
Wedding Invitation/
├── index.html                 Page structure & content hooks
├── css/
│   └── style.css              All styling, tokens & animations
├── js/
│   ├── config.js              ⭐ All wedding content (names, dates, venue…)
│   ├── rsvp-config.js         ⭐ Google Apps Script URL for the RSVP form
│   └── main.js                Renders config → DOM, handles all behavior
├── assets/
│   ├── images/                og-image.jpg, floral/corner SVG flourishes
│   │   └── illustrations/     Hero & couple artwork (swap these to restyle)
│   ├── music/                 Background music (music.mp3)
│   ├── icons/                 Favicon / apple-touch-icon source PNGs
│   └── fonts/                 (optional) place self-hosted fonts here
├── favicon.ico
├── google-apps-script.js      Paste into Google Apps Script — RSVP backend
└── README.md                  You are here
```

---

## 1. Quick Customization Guide

Everything below is a change inside **`js/config.js`** only.

### Change the couple's names
```js
couple: {
  brideFirstName: "Amreen",
  groomFirstName: "Mashoodh",
  bride: { fullName: "Amreen Anwar", family: "...", father: "...", mother: "...", grandparents: [...] },
  groom: { fullName: "Ar. Mashoodh Masoofar KV", ... }
}
```
These values populate the opening screen, hero, and the Bride & Groom cards
automatically — including the footer monogram, which is generated from the
first letters of `brideFirstName` / `groomFirstName`.

### Change the date, time & Hijri date
```js
wedding: {
  dateISO: "2026-08-15T16:00:00+05:30", // used by the live countdown — include the correct timezone offset
  dateDisplay: "15 August 2026",
  dayDisplay: "Saturday",
  hijriDate: "2 Rabi' ul-Awwal 1448 AH",
  timeDisplay: "4:00 PM",
  ...
}
```

### Change the countdown
The countdown is driven entirely by `wedding.dateISO` above — nothing else
to configure. Once the target date/time passes, the countdown automatically
hides and an "Alhamdulillah, the celebration has begun" message appears.

### Change the venue & Google Map
```js
venue: {
  lat: 10.7832454,
  lng: 76.6700768,
  mapsShareUrl: "https://maps.app.goo.gl/...",
  mapsEmbedUrl: "https://www.google.com/maps?q=LAT,LNG&z=16&output=embed",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=LAT,LNG"
}
```
To get these values: open the location in Google Maps → **Share** →
**Embed a map** (for `mapsEmbedUrl`) and **Share a link** (for
`mapsShareUrl` / `directionsUrl`), or simply replace `LAT,LNG` with your
venue's coordinates in each URL above.

### Replace the background music
1. Drop your `.mp3` file into `assets/music/` (replacing `music.mp3`, or
   using a new filename).
2. Update the path in `config.js`:
   ```js
   music: { src: "assets/music/your-file.mp3", title: "Wedding Theme" }
   ```
The floating music button in the bottom-right corner handles play, pause,
and gracefully falls back to a manual "tap to play" state in browsers that
block autoplay (all modern mobile browsers do this by default).

### Replace the hero / couple illustrations
All artwork lives in `assets/images/illustrations/`:

| File | Used for |
|---|---|
| `hero-couple.svg` | Hero section illustration |
| `bride-portrait.svg` | Bride & Groom section — bride card |
| `groom-portrait.svg` | Bride & Groom section — groom card |

These currently ship as elegant placeholder SVGs. **To use your own
AI-generated or hand-illustrated artwork**, export it as SVG or PNG, drop it
into `assets/images/illustrations/` with the **same filename**, and nothing
else needs to change. If you use a different filename or format, update the
three paths in `js/config.js` → `illustrations: { heroCouple: "..." }` and
`couple.bride.portrait` / `couple.groom.portrait`.

There's also an optional full-bleed, soft-opacity watercolor backdrop behind
the hero section:
```js
illustrations: {
  heroBackground: "assets/images/hero-bg.jpg" // set to "" to disable
}
```

### Change the invitation message, dua, and thank-you note
All under `invitation: {...}` and `thankYou: {...}` in `config.js` — every
string on the page (English and Arabic) is editable there.

---

## 2. Google Sheets RSVP Integration

The RSVP form saves every response into a Google Sheet via a small Google
Apps Script Web App. No server, database, or paid service required.

**Guest → Wedding Website → Google Apps Script → Google Sheet**

### Step 1 — Create the spreadsheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new,
   blank spreadsheet (name it anything, e.g. "Wedding RSVPs").

### Step 2 — Add the Apps Script
1. In the sheet, go to **Extensions → Apps Script**.
2. Delete the default `Code.gs` contents and paste in the entire contents
   of **`google-apps-script.js`** from this project.
3. Click **Save** (💾).

### Step 3 — Deploy as a Web App
1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me (your Google account)
   - **Who has access:** Anyone
4. Click **Deploy**, then **Authorize access** and approve the permissions
   Google asks for (this script only writes to this one spreadsheet).
5. Copy the **Web app URL** shown (it ends in `/exec`).

### Step 4 — Connect the website to the script
Open **`js/rsvp-config.js`** and paste the URL:
```js
window.RSVP_CONFIG = {
  scriptURL: "https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec"
};
```
That's it — the RSVP form is now live. If `scriptURL` is left empty, the
form is automatically disabled and shows "RSVP is currently unavailable."
instead of breaking.

### What the script does
- Automatically creates the header row (`Timestamp`, `Full Name`,
  `Mobile Number`, `Email`, `Bride/Groom Side`, `Will Attend`,
  `Number of Guests`, `Message`) the first time it runs.
- Appends every new RSVP as a new row, with the timestamp generated by
  the script itself (not the browser).
- **Detects duplicate submissions by mobile number.** If a guest submits
  the RSVP form again with the same mobile number (e.g. to change their
  attendance or guest count), their existing row is **updated in place**
  instead of a new row being added.
- Always responds with JSON (`{ status: "success" | "error", ... }`).

### Re-deploying after you edit the script
If you ever change `google-apps-script.js` and re-paste it into an
*existing* deployment, use **Deploy → Manage deployments → ✏️ Edit → New
version → Deploy** so the live URL keeps working — creating a brand-new
deployment instead will generate a different `/exec` URL that you'd need to
update in `rsvp-config.js` again.

---

## 3. Social Sharing Preview (WhatsApp / Instagram / Facebook / etc.)

`index.html` already includes Open Graph and Twitter Card meta tags, plus
`assets/images/og-image.jpg` (1200×630) as the preview image. Because
crawlers for WhatsApp, Instagram DMs, Facebook, Telegram, and LinkedIn do
**not** execute JavaScript, these specific tags must be edited **by hand**
in `index.html` `<head>` when you reuse this template for a new couple —
everything else on the page comes from `config.js`, but this handful of
static tags cannot:

```html
<title>Amreen &amp; Mashoodh — Wedding Invitation</title>
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="assets/images/og-image.jpg">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
```
Replace `assets/images/og-image.jpg` with your own 1200×630 image to change
the shared preview photo.

---

## 4. Deployment

This is a fully static site — it works as-is on any static host, no build
step required:

- **Cloudflare Pages** — drag-and-drop the `Wedding Invitation` folder, or
  connect a Git repo with output directory `/`.
- **GitHub Pages** — push this folder to a repo and enable Pages on the
  `main` branch (root).
- **Netlify** — drag-and-drop the folder onto the Netlify dashboard, or
  connect a repo with no build command and publish directory `/`.
- **Vercel** — `vercel deploy` from inside this folder, framework preset
  "Other".

The only external dependency is the Google Apps Script RSVP endpoint, which
needs no server of its own — Google hosts it for you.

After deploying, set `meta.siteUrl` in `config.js` to your live URL (used
for reference only; add an `og:url` tag manually if you want it in the meta
tags too).

---

## 5. Accessibility & Performance Notes

- Single `<h1>` (hero heading) with a logical `h2` → `h3` hierarchy through
  the rest of the page; the opening splash screen's title is marked up as
  `role="heading" aria-level="2"` rather than a second `<h1>`.
- All decorative images/icons use `aria-hidden="true"` and empty `alt=""`;
  meaningful images (portraits, hero illustration) have descriptive `alt`
  text sourced from `config.js`.
- Visible focus rings on all interactive elements (`:focus-visible`).
- `prefers-reduced-motion` is respected — animations collapse to near-zero
  duration for users who request reduced motion.
- The Google Map `<iframe>` uses `loading="lazy"`; the background music
  uses `preload="none"` so it doesn't block page load.
- RSVP dialogs use `role="dialog"` / `aria-modal="true"` and close on
  <kbd>Esc</kbd> or backdrop click.
- Fonts are loaded via `preconnect` + a single Google Fonts stylesheet
  request with `display=swap` to avoid invisible text during load.

---

## 6. Browser Support

Tested against current Chrome, Edge, Firefox, Safari, Android Chrome, and
iOS Safari. The only progressive-enhancement fallback is the scroll-reveal
animation, which simply shows all content immediately in browsers without
`IntersectionObserver` support.

---

## 7. FAQ

**Q: Can I use this for a non-Muslim wedding?**
Yes — remove or edit the Bismillah/dua sections in both `index.html` and
`config.js`; every other section is faith-agnostic.

**Q: The RSVP shows "RSVP is currently unavailable."**
This means `js/rsvp-config.js` → `scriptURL` is empty or the Apps Script
deployment isn't live. Re-check Step 3–4 in Section 2 above.

**Q: How do I reset all RSVPs during testing?**
Just delete the data rows in your Google Sheet (keep the header row) — the
script will keep working normally.
