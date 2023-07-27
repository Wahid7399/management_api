
const express = require("express");
const app = express();
app.use(express.json());
require("./connect")();
const router=require("./route");

app.use("/api/users", router);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));