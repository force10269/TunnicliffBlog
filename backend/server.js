const { app } = require("./app.js");
require("dotenv").config({ path: "./.env" });

const port = parseInt(process.env.PORT, 10) | 3000;

app.listen(port, () => console.log(`Server started at port: ${port}`));
