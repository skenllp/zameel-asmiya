/* ============================================================
   RSVP CONFIGURATION
   ------------------------------------------------------------
   This file holds ONLY the Google Apps Script Web App URL that
   powers the RSVP form (see /google-apps-script.js for the
   script you deploy, and README.md → "Google Sheets RSVP
   Integration" for step-by-step setup instructions).

   Kept separate from js/config.js on purpose: the wedding
   details in config.js are safe to commit/share freely, while
   this URL is specific to a single deployment and is the first
   thing you'll change when reusing the template for a new
   wedding.

   HOW TO SET THIS UP
   1. Open Google Sheets, create a new spreadsheet (e.g. "RSVPs").
   2. Extensions → Apps Script, paste in /google-apps-script.js.
   3. Deploy → New deployment → type "Web app".
        - Execute as: Me
        - Who has access: Anyone
   4. Copy the deployment URL (ends in /exec) and paste it below.

   Leave scriptURL empty to keep the RSVP form disabled — visitors
   will see "RSVP is currently unavailable." instead of a broken
   form or a raw JavaScript error.
   ============================================================ */

window.RSVP_CONFIG = {
  scriptURL: "https://script.google.com/macros/s/AKfycbzjrMgENlHHMucKW7SmfBXOmJyyXTaIRm3uQ4Xn0Q6FQxsQbJHqS02IFDitlHp-F0s/exec"
};
