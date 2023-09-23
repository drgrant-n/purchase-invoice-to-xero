function onFormSubmit(e) {
    var sheet = e.source.getSheetByName('Form responses 1');
    var lastRow = sheet.getLastRow();
    var range = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn());
    var values = range.getValues();
    var newRow = values[0];

    var webhookSheet = e.source.getSheetByName('Webhook');
    var lastRowWebhook = webhookSheet.getLastRow() + 1;

    // Copy newRow values to Webhook sheet
    webhookSheet.getRange(lastRowWebhook, 1, 1, newRow.length).setValues([newRow]);

    // Set formula in Column E and F
    webhookSheet.getRange(lastRowWebhook, 5).setFormula("=ROW()");
    var formulaF = '=IFERROR(RIGHT(D' + lastRowWebhook + ', FIND("?id=", D' + lastRowWebhook + ') - 1),"")';
    webhookSheet.getRange(lastRowWebhook, 6).setFormula(formulaF);

    var colDValue = newRow[3];
    if (!colDValue || (colDValue.split(',').length === 1)) {
        webhookSheet.getRange(lastRowWebhook, 7).setValue(true); // Setting column G to TRUE
        renameFile(webhookSheet, lastRowWebhook);
    } else {
        var splitValues = colDValue.split(',');
        splitValues.forEach(function(value, index) {
            if(index === 0) {
                webhookSheet.getRange(lastRowWebhook, 4).setValue(value);
                webhookSheet.getRange(lastRowWebhook, 7).setValue(true);
                renameFile(webhookSheet, lastRowWebhook);
            } else {
                var newRowValues = newRow.slice();
                newRowValues[3] = value.trim();
                newRowValues[6] = true;
                webhookSheet.appendRow(newRowValues);
                lastRowWebhook = webhookSheet.getLastRow();
                webhookSheet.getRange(lastRowWebhook, 5).setFormula("=ROW()");
                var formulaF = '=IFERROR(RIGHT(D' + lastRowWebhook + ', FIND("?id=", D' + lastRowWebhook + ') - 1),"")';
                webhookSheet.getRange(lastRowWebhook, 6).setFormula(formulaF);
                webhookSheet.getRange(lastRowWebhook, 7).setValue(true); // Setting column G to TRUE
                renameFile(webhookSheet, lastRowWebhook);
            }
            Utilities.sleep(2000);
        });
    }
}

function renameFile(sheet, row) {
    var fileId = sheet.getRange(row, 6).getValue();
    var colEValue = sheet.getRange(row, 5).getValue();

    if (fileId) {
        try {
            var file = DriveApp.getFileById(fileId);
            var oldName = file.getName();
            var newName = colEValue + " - " + oldName;
            file.setName(newName);
        } catch (e) {
            console.error("Error occurred: " + e.toString());
        }
    }
}
