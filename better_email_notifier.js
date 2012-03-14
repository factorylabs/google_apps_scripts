/*
Send Detailed Email on Row Change

requires ./lib

Google's built-in range notifier does not include
info about what changed.
*/

function sendNotification(event) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    , sheet = spreadsheet.getActiveSheet()
    , updated_range = spreadsheet.getActiveRange()
    , updated_row_index = updated_range.getRow()
    , updated_row_range = sheet.getRange(updated_row_index, 1, 1, sheet.getMaxColumns())
    , full_row_data = getRowsData(sheet, updated_row_range, 1)[0];
  
  if(typeof full_row_data.notify != 'undefined' && full_row_data.notify.indexOf('@') > 0 ){
    var email = full_row_data.notify
      , changed_object = getRowsData(sheet, updated_range, 1)[0]
      , changed_keys = [];
    
    for(var key in changed_object){
      if(key != 'notify'){ changed_keys.push('\''+ key +'\''); }
    }
    
    if(changed_keys.length > 1){
      changed_keys.splice(changed_keys.length-1, 0, 'and');
      changed_keys = changed_keys.join(', ').replace(/,([^,]*)$/, "$1");
    } else {
      changed_keys = changed_keys.join('');
    }

    var change_text = 'You are subscribed to changes in the document "'+ spreadsheet.getName();
    change_text += '". Here is the new data where '+ changed_keys +' changed:\n\n';
    
    for(var key in full_row_data){
      if(key != 'notify'){ change_text += key +': '+ full_row_data[key] +', '; }
    }
    change_text = change_text.substring(0, change_text.length-2);
    change_text += '\n\n ' + spreadsheet.getUrl(); // add the document's URL
    
    // Strange bug: you can't call both msgBox and sendEmail in the same method...
    // Also, you can't call sendEmail using the automatic trigger onEdit; must use an installed trigger.
    
    //Browser.msgBox('DEBUG :: Trying to send notification to '+ email +' -- '+ change_text); // swap commenting to debug email
    MailApp.sendEmail(email, 'DOCS > A document changed', change_text, {noReply: true});
  
  } else {
    //Browser.msgBox('No one will be notified');
    //Browser.msgBox('DEBUG :: Row data: '+ JSON.stringify(full_row_data));
  }
}
