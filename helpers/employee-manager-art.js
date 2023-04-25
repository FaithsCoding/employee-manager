const figlet = require("figlet");
// Helper function to create a logo for the programme which demonstrates the title of the project
const art = () =>
  figlet("Employee Manager", "doom", (err, rendered) => {
    if (err) throw err;
    console.log(rendered);
  });
module.exports = art;
