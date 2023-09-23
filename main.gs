function onFormSubmit(e) {
  // Get 'Form Submission 1' sheet
  var formSubmissionSheet = e.source.getSheetByName('Form responses 1');
  // Get the last row data from 'Form Submission 1'
  var lastRow = formSubmissionSheet.getLastRow();
  var lastColumn = formSubmissionSheet.getLastColumn();
  var range = formSubmissionSheet.getRange(lastRow, 1, 1, lastColumn);
  var values = range.getValues();
  var newRow = values[0];
  
  // Get 'Processed' sheet
  var processedSheet = e.source.getSheetByName('Processed');
  
  var colWithFilePaths = newRow[newRow.length - 1]; // Assuming the last column contains the file paths.
  
  // If the last column is empty or contains one value
  if (!colWithFilePaths || (colWithFilePaths.split(',').length === 1)) {
    processedSheet.appendRow(newRow); // Append the row to 'Processed' sheet
  }
  // If the last column contains more than one value after splitting by ','
  else {
    var splitValues = colWithFilePaths.split(',');
    splitValues.forEach(function(value) {
      // Make a copy of the newRow array
      var newRowValues = newRow.slice();
      newRowValues[newRowValues.length - 1] = value.trim(); // Update the value in the last column
      processedSheet.appendRow(newRowValues); // Append the new row to the 'Processed' sheet
    });
  }
}
