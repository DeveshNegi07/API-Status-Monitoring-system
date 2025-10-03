const express = require("express");
const dbConnect = require("./config/db");
const cors = require("cors");
const apiTracer = require("./middleware/apiTracerMiddleware");

const app = express();
//.env config
require("dotenv").config();
//db connection
dbConnect();

//port
const port = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//require routes
const configRoutes = require("./routes/configRoutes");
const logRoutes = require("./routes/logRoutes");
const statsRoutes = require("./routes/statsRoutes");
const statusRoutes = require("./routes/statusRoutes");
const testRoutes = require("./routes/test");

app.use("/api/config", configRoutes);
app.use("/api/log", logRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api", statusRoutes);
app.use("/api/test", testRoutes);

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
