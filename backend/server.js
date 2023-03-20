const { app } = require("./app.js");
require("dotenv").config({ path: "./.env" });

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => console.log(`Server started at port: ${port}`));
