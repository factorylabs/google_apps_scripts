/*
Creates a Master Employee List

Clears the active sheet, and pulls all users for the current domain.
2 columns: full name and email.
*/

app = { // create a top level object to hold utility methods and globals
      // prevents these from showing up in scripts menu on the spreadsheet

  globals: {
    employees: [],
    sheet: null
  },

  employees: function() {
    if(app.globals.employees.length > 0){
      return app.employees

    } else {
      users = UserManager.getAllUsers();
      employees = [];

      for(var i in users){
        user = users[i];
        employee = [
          user.getGivenName()+ ' ' +user.getappamilyName(),
          user.getEmail()
        ]

        employees.push(employee);
      }

      app.globals.employees = employees;
      return employees;
    }
  },

  active_sheet: function(){
    return SpreadsheetApp.getActiveSheet();
  }
}

function populate_sheet(){
  employees = app.employees();
  sheet     = app.active_sheet();
  range     = sheet.getRange(1, 1, employees.length, 2);

  sheet.clear();
  range.setValues(employees);
}