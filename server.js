const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

// Setup view engine
app.set("view engine", "pug");

// Static resources
app.use(express.static(path.resolve(path.join(__dirname, "/public"))));
app.use(cors());

// Render Pages
app.get("*", (req, res) => {
  res.render("index", { title: "Email Simulator" });
});

// Startup
app.listen(port, () => {
  console.log(`
  ███████╗███╗   ███╗ █████╗ ██╗██╗         ███████╗██╗███╗   ███╗██╗   ██╗██╗      █████╗ ████████╗ ██████╗ ██████╗ 
  ██╔════╝████╗ ████║██╔══██╗██║██║         ██╔════╝██║████╗ ████║██║   ██║██║     ██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
  █████╗  ██╔████╔██║███████║██║██║         ███████╗██║██╔████╔██║██║   ██║██║     ███████║   ██║   ██║   ██║██████╔╝
  ██╔══╝  ██║╚██╔╝██║██╔══██║██║██║         ╚════██║██║██║╚██╔╝██║██║   ██║██║     ██╔══██║   ██║   ██║   ██║██╔══██╗
  ███████╗██║ ╚═╝ ██║██║  ██║██║███████╗    ███████║██║██║ ╚═╝ ██║╚██████╔╝███████╗██║  ██║   ██║   ╚██████╔╝██║  ██║
  ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚══════╝    ╚══════╝╚═╝╚═╝     ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
                                                                                                                      
 `);
  console.log(`App listening on port ${port}`);
  console.log("Press Ctrl+C to quit.");
});
