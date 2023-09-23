function onFormSubmit(e) {
    var sheet = e.source.getSheetByName('Form responses 1'); 
    var lastRow = sheet.getLastRow();
    var range = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn());
    var values = range.getValues();
    var newRow = values[0];

    // Logger.log(newRow);
    var webhookSheet = e.source.getSheetByName('Webhook'); 
    var lastRowWebhook = webhookSheet.getLastRow() + 1;

    // Check the value of column D
    var colDValue = newRow[3]; // Arrays are 0-indexed, so 3 corresponds to column D
    
    webhookSheet.getRange(lastRowWebhook, 1, 1, newRow.length).setValues([newRow]); // Copy newRow values to Webhook sheet
    webhookSheet.getRange(lastRowWebhook, 5).setFormula('="KAYBE-00"&ROW()-2'); // Set formula in Column E
    var formulaF = '=IFERROR(RIGHT(D' + lastRowWebhook + ', FIND("?id=", D' + lastRowWebhook + ') - 1),"")';
    webhookSheet.getRange(lastRowWebhook, 6).setFormula(formulaF); // Set formula in Column F

    // If column D is empty or contains one value after splitting by ','
    if (!colDValue || (colDValue.split(',').length === 1)) {
        webhookSheet.getRange(lastRowWebhook, 7).setValue(true); // Setting column G to TRUE
    } 
    // If column D contains more than one value after splitting by ','
    else {
        var splitValues = colDValue.split(',');
        splitValues.forEach(function(value, index) {
            if(index === 0) { // Update the current last row for the first value
                webhookSheet.getRange(lastRowWebhook, 4).setValue(value); // Set column D to one of the split values
                webhookSheet.getRange(lastRowWebhook, 7).setValue(true); // Set column G to TRUE
            } else { // Add new rows for the remaining values
                var newRowValues = newRow.slice(); // Make a copy of the newRow array
                newRowValues[3] = value.trim(); // Update the value in column D
                newRowValues[6] = true; // Set the value in column G to TRUE
                webhookSheet.appendRow(newRowValues); // Append the new row to the Webhook sheet
                lastRowWebhook = webhookSheet.getLastRow(); // Update lastRowWebhook after appending a new row
                webhookSheet.getRange(lastRowWebhook, 5).setFormula('="KAYBE-00"&ROW()-2'); // Set formula in Column E
                var formulaF = '=IFERROR(RIGHT(D' + lastRowWebhook + ', FIND("?id=", D' + lastRowWebhook + ') - 1),"")';
                webhookSheet.getRange(lastRowWebhook, 6).setFormula(formulaF); // Set formula in Column F
            }
            // Pausing 2 seconds between creating each new row
            Utilities.sleep(2000);
        });
    }
}
