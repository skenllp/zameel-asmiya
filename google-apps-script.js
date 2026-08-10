 /* ============================================================================
   WEDDING RSVP — GOOGLE APPS SCRIPT BACKEND
   ------------------------------------------------------------------------
   Paste this entire file into Extensions → Apps Script on the Google
   Sheet you want RSVPs saved to, then deploy it as a Web App.
   See README.md → "Google Sheets RSVP Integration" for full step-by-step
   deployment instructions.

   WHAT THIS SCRIPT DOES
   - Creates the header row automatically the first time it runs.
   - Appends every new RSVP as a new row.
   - Looks up submissions by mobile number: if the same mobile number
     RSVPs again (e.g. someone changes their mind about attending, or
     updates the guest count), the EXISTING row is updated in place
     instead of a duplicate row being created.
   - Always responds with JSON, and enables CORS so the request can be
     made from the wedding website's front-end fetch() call.
   ============================================================================ */

/* ---------------------------------------------------------------------- */
/* CONFIGURATION — change these if you rename your sheet or columns       */
/* ---------------------------------------------------------------------- */
const SHEET_NAME = "RSVPs"; // tab name inside the spreadsheet; created automatically if missing

const COLUMNS = [
  "Timestamp",
  "Full Name",
  "Mobile Number",
  "Email",
  "Bride/Groom Side",
  "Will Attend",
  "Number of Guests",
  "Message"
];

// Column index (0-based) used to detect duplicate submissions.
const MOBILE_COLUMN_INDEX = COLUMNS.indexOf("Mobile Number");

/* ---------------------------------------------------------------------- */
/* ENTRY POINTS                                                            */
/* ---------------------------------------------------------------------- */

/**
 * Handles POST requests from the wedding website's RSVP form.
 * Expects a JSON body with: fullName, mobile, email, side, attending,
 * guests, message.
 */
function doPost(e) {
  try {
    const data = parseRequestBody(e);
    const result = saveRsvp(data);
    return jsonResponse({ status: "success", updated: result.updated, row: result.row });
  } catch (err) {
    return jsonResponse({ status: "error", message: String(err && err.message ? err.message : err) });
  }
}

/**
 * A simple GET handler so you can open the deployment URL in a browser
 * to confirm the script is live (useful while debugging deployment).
 */
function doGet(e) {
  return jsonResponse({ status: "ok", message: "Wedding RSVP endpoint is live." });
}

/* ---------------------------------------------------------------------- */
/* CORE LOGIC                                                              */
/* ---------------------------------------------------------------------- */

/**
 * Validates and writes (or updates) an RSVP row in the target sheet.
 * Returns { updated: boolean, row: number }.
 */
function saveRsvp(data) {
  const fullName = cleanString(data.fullName);
  const mobile = cleanString(data.mobile);

  if (!fullName) throw new Error("Full name is required.");
  if (!mobile) throw new Error("Mobile number is required.");

  const sheet = getOrCreateSheet();
  ensureHeaders(sheet);

  const rowValues = [
    new Date(),                              // Timestamp — always generated server-side
    fullName,                                // Full Name
    mobile,                                  // Mobile Number
    cleanString(data.email),                 // Email
    formatSide(data.side),                   // Bride/Groom Side
    formatAttending(data.attending),         // Will Attend
    cleanGuestCount(data.guests),            // Number of Guests
    cleanString(data.message)                // Message
  ];

  const existingRow = findRowByMobile(sheet, mobile);

  if (existingRow) {
    // Update the existing guest's response in place instead of duplicating.
    sheet.getRange(existingRow, 1, 1, COLUMNS.length).setValues([rowValues]);
    return { updated: true, row: existingRow };
  }

  sheet.appendRow(rowValues);
  return { updated: false, row: sheet.getLastRow() };
}

/**
 * Finds the row number (1-based, including header) of an existing RSVP
 * with a matching mobile number. Returns null if not found.
 * Mobile numbers are compared after stripping spaces/dashes so that
 * "+91 98765 43210" and "+919876543210" are treated as the same guest.
 */
function findRowByMobile(sheet, mobile) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null; // only the header exists so far

  const values = sheet
    .getRange(2, MOBILE_COLUMN_INDEX + 1, lastRow - 1, 1)
    .getValues();

  const target = normalizePhone(mobile);
  for (let i = 0; i < values.length; i++) {
    if (normalizePhone(values[i][0]) === target) {
      return i + 2; // +2: skip header row, convert to 1-based index
    }
  }
  return null;
}

/* ---------------------------------------------------------------------- */
/* SHEET / HEADER SETUP                                                    */
/* ---------------------------------------------------------------------- */

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

/**
 * Writes the header row if the sheet is empty, and freezes it for
 * readability. Safe to call on every request — it's a no-op once
 * headers already exist.
 */
function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
  }
}

/* ---------------------------------------------------------------------- */
/* FORMATTING / VALIDATION HELPERS                                         */
/* ---------------------------------------------------------------------- */

function cleanString(value) {
  return (value === undefined || value === null) ? "" : String(value).trim();
}

function normalizePhone(value) {
  return cleanString(value).replace(/[\s\-()]/g, "");
}

function cleanGuestCount(value) {
  const n = parseInt(value, 10);
  if (isNaN(n) || n < 1) return 1;
  return Math.min(n, 20); // sane upper bound
}

function formatSide(value) {
  const v = cleanString(value).toLowerCase();
  if (v === "groom") return "Groom Side";
  if (v === "bride") return "Bride Side";
  return cleanString(value) || "Bride Side";
}

function formatAttending(value) {
  const v = cleanString(value).toLowerCase();
  if (v === "yes") return "Yes";
  if (v === "no") return "No";
  return cleanString(value) || "Yes";
}

/* ---------------------------------------------------------------------- */
/* REQUEST / RESPONSE HELPERS                                              */
/* ---------------------------------------------------------------------- */

/**
 * Parses the JSON body of an incoming request. Apps Script web apps do
 * not support custom CORS headers on preflight OPTIONS requests, so the
 * front-end sends this as a "simple request" (text/plain body containing
 * JSON) to avoid a CORS preflight altogether. This function accepts both
 * that and a standard application/json body for flexibility.
 */
function parseRequestBody(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("No data received.");
  }
  return JSON.parse(e.postData.contents);
}

/**
 * Wraps a JS object as a JSON Apps Script response.
 * Apps Script web apps automatically allow cross-origin requests for
 * simple POST requests like the one this template sends, so no extra
 * CORS headers are required here.
 */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
