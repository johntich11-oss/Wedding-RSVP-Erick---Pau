/**
 * ============================================================================
 * ERICK & PAU WEDDING RSVP & SITE SETTINGS - GOOGLE APPS SCRIPT
 * ============================================================================
 * Features:
 * 1. RSVP Collection:
 *    Appends guest RSVPs to the "RSVP Responses" sheet.
 *    Columns: Timestamp, Full Name, Attendance, Note/Message
 *
 * 2. Dynamic Real-time Settings:
 *    Allows couple to control site settings from the "Settings" sheet:
 *    - reservedSeats: e.g. "2" (bold number on the reserved seats underline)
 *    - heroImage: e.g. direct image link or Google Drive link (leave blank for default)
 * ============================================================================
 */

function setupSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Setup RSVP Responses sheet
  var rsvpSheet = spreadsheet.getSheetByName("RSVP Responses");
  if (!rsvpSheet) {
    var sheets = spreadsheet.getSheets();
    if (sheets.length === 1 && sheets[0].getName() === "Sheet1") {
      rsvpSheet = sheets[0];
      rsvpSheet.setName("RSVP Responses");
    } else {
      rsvpSheet = spreadsheet.getActiveSheet();
      if (rsvpSheet.getName() !== "Settings" && rsvpSheet.getName() !== "Config") {
        rsvpSheet.setName("RSVP Responses");
      } else {
        rsvpSheet = spreadsheet.insertSheet("RSVP Responses");
      }
    }
  }
  
  var rsvpHeaders = [
    "Timestamp",
    "Full Name",
    "Attendance",
    "Note/Message"
  ];
  
  if (rsvpSheet.getLastRow() === 0) {
    rsvpSheet.appendRow(rsvpHeaders);
    var headerRange = rsvpSheet.getRange(1, 1, 1, rsvpHeaders.length);
    headerRange.setBackground("#455230"); // Olive Green header
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    rsvpSheet.setFrozenRows(1);
    
    rsvpSheet.setColumnWidth(1, 180); // Timestamp
    rsvpSheet.setColumnWidth(2, 220); // Full Name
    rsvpSheet.setColumnWidth(3, 160); // Attendance
    rsvpSheet.setColumnWidth(4, 350); // Note/Message
  }
  
  // 2. Setup Settings sheet
  var settingsSheet = spreadsheet.getSheetByName("Settings") || spreadsheet.getSheetByName("Config");
  if (!settingsSheet) {
    settingsSheet = spreadsheet.insertSheet("Settings");
    settingsSheet.appendRow(["Setting Key", "Value", "Description / Instructions"]);
    settingsSheet.appendRow(["reservedSeats", "2", "Number of reserved seats shown in bold underline (e.g. 1, 2, 3...)"]);
    settingsSheet.appendRow(["heroImage", "", "Link to hero background image (Google Drive link or direct image link). Leave blank to use original photo."]);
    
    var sHeader = settingsSheet.getRange(1, 1, 1, 3);
    sHeader.setBackground("#455230");
    sHeader.setFontColor("#FFFFFF");
    sHeader.setFontWeight("bold");
    sHeader.setHorizontalAlignment("center");
    settingsSheet.setFrozenRows(1);
    
    settingsSheet.setColumnWidth(1, 180);
    settingsSheet.setColumnWidth(2, 380);
    settingsSheet.setColumnWidth(3, 440);
  }
}

/**
 * Reads dynamic settings from the "Settings" sheet
 */
function getSiteConfig() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var config = {
    reservedSeats: "2",
    heroImage: ""
  };
  
  var settingsSheet = spreadsheet.getSheetByName("Settings") || spreadsheet.getSheetByName("Config");
  
  if (settingsSheet && settingsSheet.getLastRow() > 1) {
    var values = settingsSheet.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      var rawKey = String(values[i][0] != null ? values[i][0] : "").trim().toLowerCase();
      var rawVal = String(values[i][1] != null ? values[i][1] : "").trim();
      
      if (rawKey === "reservedseats" || rawKey === "seats" || rawKey === "reserved seats" || rawKey === "seat") {
        config.reservedSeats = rawVal || "2";
      } else if (rawKey === "heroimage" || rawKey === "hero image" || rawKey === "hero" || rawKey === "image" || rawKey === "herobackground") {
        config.heroImage = rawVal;
      }
    }
  } else {
    // If Settings tab does not exist yet, auto-create it with default values
    try {
      setupSheet();
    } catch (e) {
      // ignore
    }
  }
  
  return config;
}

/**
 * Handles GET requests: returns real-time site configuration
 */
function doGet(e) {
  var config = getSiteConfig();
  
  var responseData = {
    status: "success",
    reservedSeats: config.reservedSeats || "2",
    heroImage: config.heroImage || "",
    timestamp: new Date().toISOString()
  };
  
  var jsonOutput = JSON.stringify(responseData);
  
  // Support JSONP if a callback parameter is provided
  if (e && e.parameter && e.parameter.callback) {
    return ContentService
      .createTextOutput(e.parameter.callback + "(" + jsonOutput + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  
  return ContentService
    .createTextOutput(jsonOutput)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handles POST requests: saves RSVP responses
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(5000);
  
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName("RSVP Responses") || spreadsheet.getActiveSheet();
    
    // Only configure header row if sheet is brand new/empty
    if (sheet.getLastRow() === 0) {
      setupSheet();
      sheet = spreadsheet.getSheetByName("RSVP Responses") || spreadsheet.getActiveSheet();
    }
    
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }
    
    var timestamp = new Date();
    var fullName = data.fullName || "";
    var attendance = data.attendance || "";
    var message = data.message || "";
    
    sheet.appendRow([
      timestamp,
      fullName,
      attendance,
      message
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "RSVP saved successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
