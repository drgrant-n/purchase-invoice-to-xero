function onFormSubmit(e) {
  // Access the 'Form responses 1' sheet from the spreadsheet linked to the form
  var formSubmissionSheet = e.source.getSheetByName('Form responses 1');

  // Retrieve the latest form submission details from 'Form responses 1'
  var lastRow = formSubmissionSheet.getLastRow();
  var range = formSubmissionSheet.getRange(lastRow, 1, 1, formSubmissionSheet.getLastColumn());
  var newRow = range.getValues()[0];

  // Access the 'Processed' sheet from the same spreadsheet
  var processedSheet = e.source.getSheetByName('Processed');

  // Retrieve the file paths from the last column of the latest submission
  var colWithFilePaths = newRow[newRow.length - 1];

  if (!colWithFilePaths) {
    // Process and append the new row to 'Processed' sheet when there are no file paths
    appendAndProcessRow(processedSheet, newRow, null);
  } else {
    var filePaths = colWithFilePaths.split(','); // Split multiple file paths if present
    filePaths.forEach((filePath, index) => {
      // Process and append each file path separately to 'Processed' sheet
      var rowValues = newRow.slice();
      rowValues[rowValues.length - 1] = filePath.trim();
      appendAndProcessRow(processedSheet, rowValues, index);
    });
  }
}

function appendAndProcessRow(sheet, rowValues, index) {
  // Append the row to the 'Processed' sheet and perform additional processing
  sheet.appendRow(rowValues);
  var rowNumber = sheet.getLastRow();
  
  // Generate and set the invoice number to the 5th column (E) of the appended row
  var invoiceNumber = "SUP-INV" + ("00000" + rowNumber).slice(-6);
  sheet.getRange(rowNumber, 5).setValue(invoiceNumber);

  // Perform additional processing only if a file path is present in the row
  if (rowValues[rowValues.length - 1]) {
    var fileID = rowValues[rowValues.length - 1].split("?id=")[1];
    const fileName = DriveApp.getFileById(fileID).getName();
    sheet.getRange(rowNumber, 6).setValue(fileName);
    var newName = invoiceNumber + '-' + fileName;
    DriveApp.getFileById(fileID).setName(newName);
    sendEmail(fileID, newName);
  }
  
  // Set the processed flag to true in the 8th column (H) of the appended row
  sheet.getRange(rowNumber, 8).setValue(true);
}

function sendEmail(fileID, subject) {
  // Send an email with the attached file and relevant details
  var recipient = "grant.naylor@kaybe.co.uk";
  var body = "See the attached file";
  var attachedFiles = [DriveApp.getFileById(fileID)];
  MailApp.sendEmail(recipient, subject, body, { attachments: attachedFiles });
}
