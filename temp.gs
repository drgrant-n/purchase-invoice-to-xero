function onFormSubmit(e) {
  // Get the 'Form responses 1' sheet from the event source object,
  // where form submissions are stored by default.
  var formSubmissionSheet = e.source.getSheetByName('Form responses 1');

  // Retrieve the last submitted row in 'Form responses 1' sheet by getting
  // the last row number and column number and then fetching the range and its values.
  var lastRow = formSubmissionSheet.getLastRow();
  var lastColumn = formSubmissionSheet.getLastColumn();
  var range = formSubmissionSheet.getRange(lastRow, 1, 1, lastColumn);
  var values = range.getValues();
  // Store the values of the last submitted row in the 'newRow' array.
  var newRow = values[0];

  // Get the 'Processed' sheet from the event source object to
  // store processed form submission data.
  var processedSheet = e.source.getSheetByName('Processed');

  // Retrieve the content of the last column from 'newRow' assuming it contains file paths.
  var colWithFilePaths = newRow[newRow.length - 1];

  // If the last column (containing file paths) is empty or contains one value.
  if (!colWithFilePaths) { // If there are no file names.
    // Append the entire 'newRow' array as a new row to the 'Processed' sheet.
    processedSheet.appendRow(newRow);

    // Generate an invoice number in the format "SUP-INV00000x" using the row number,
    // where 'x' corresponds to the row number (padded with zeros to maintain the format),
    // and assign it to the 5th column (E) of the last row in the 'Processed' sheet.
    var row = processedSheet.getLastRow() - 1;
    var invoiceNumber = "SUP-INV" + ("00000" + row).slice(-6);
    processedSheet.getRange(processedSheet.getLastRow(), 5).setValue(invoiceNumber);
    processedSheet.getRange(processedSheet.getLastRow(), 6).setValue('test');
    // Set the value in the 8th column (H) of the last row in the 'Processed' sheet as true,
    // indicating the row has been processed.
    processedSheet.getRange(processedSheet.getLastRow(), 8).setValue(true);
  }
  else if (colWithFilePaths.split(',').length === 1) { // If there is one file name.
    // Similar to the process above for rows with one file path.
    processedSheet.appendRow(newRow);
    var row = processedSheet.getLastRow() - 1;
    var invoiceNumber = "SUP-INV" + ("00000" + row).slice(-6);
    processedSheet.getRange(processedSheet.getLastRow(), 5).setValue(invoiceNumber);

    // Extract the file ID from the file path using the split method,
    // and assign it to the 7th column (G) of the last row in the 'Processed' sheet.
    var fileID = colWithFilePaths.split("?id=");
    processedSheet.getRange(processedSheet.getLastRow(), 7).setValue(fileID[1]);

    const fileName = DriveApp.getFileById(fileID[1]).getName();
    processedSheet.getRange(processedSheet.getLastRow(), 6).setValue(fileName);
    Utilities.sleep(2000);
    var newName = invoiceNumber + '-' + fileName;
    DriveApp.getFileById(fileID[1]).setName(newName);

    // Set the value in the 8th column (H) of the last row in the 'Processed' sheet as true.
    processedSheet.getRange(processedSheet.getLastRow(), 8).setValue(true);
  }
  else { // If there are more than one file names.
    var splitValues = colWithFilePaths.split(',');
    var i = 0;
    // Iterate over each file path in the last column of 'newRow'.
    splitValues.forEach(function (value) {
      // For each file path, create a copy of 'newRow' array, update the last column
      // with the current file path, and append it as a new row to the 'Processed' sheet.
      var newRowValues = newRow.slice();
      newRowValues[newRowValues.length - 1] = value.trim();
      processedSheet.appendRow(newRowValues);

      // Similar to the process above for each row with a separate file path.
      var row = processedSheet.getLastRow() - 1;
      var invoiceNumber = "SUP-INV" + ("00000" + row).slice(-6);
      processedSheet.getRange(processedSheet.getLastRow(), 5).setValue(invoiceNumber);
      processedSheet.getRange(processedSheet.getLastRow(), 6).setValue('test');
      
      // Extract the file ID from each file path, and assign it to the corresponding row in 'Processed' sheet.
      var parts = splitValues[i];
      var fileID = parts.split("?id=");
      processedSheet.getRange(processedSheet.getLastRow(), 7).setValue(fileID[1]);
      i++;

      // Set the value in the 8th column (H) of each new row in the 'Processed' sheet as true.
      processedSheet.getRange(processedSheet.getLastRow(), 8).setValue(true);
    });
  }
}
