/**
 * ============================================================================
 * ERICK & PAU WEDDING RSVP - GOOGLE SHEETS AUTOMATION SCRIPT (SIMPLIFIED)
 * ============================================================================
 * Columns tracked:
 * 1. Timestamp
 * 2. Full Name
 * 3. Attendance
 * 4. Note/Message
 * ============================================================================
 */

function setupSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  
  var headers = [
    "Timestamp",
    "Full Name",
    "Attendance",
    "Note/Message"
  ];
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#455230"); // Olive Green header
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    
    sheet.setColumnWidth(1, 180); // Timestamp
    sheet.setColumnWidth(2, 220); // Full Name
    sheet.setColumnWidth(3, 160); // Attendance
    sheet.setColumnWidth(4, 350); // Note/Message
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(5000);
  
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getActiveSheet();
    
    // Only configure header row if sheet is brand new/empty
    if (sheet.getLastRow() === 0) {
      setupSheet();
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

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: "online", 
      message: "Erick & Pau Wedding RSVP Google Sheets Webhook is active!" 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
