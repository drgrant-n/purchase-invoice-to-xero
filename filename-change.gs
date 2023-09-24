function onFormSubmit(e) {
  // Get the submitted values
  const formResponses = e.values; // An array of form responses

  // Drive File ID
  const fileId = formResponses[3].split("?id=");

  // var oldName = DriveApp.getFileById(fileId).getName();
  DriveApp.getFileById(fileId[1]).setName("NEW NAME");

  // Log the responses
  Logger.log(fileId[1]);
}
