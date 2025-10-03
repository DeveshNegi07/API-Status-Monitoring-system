const express = require("express");
const router = express.Router();
const apiTracer = require("../middleware/apiTracerMiddleware");

router.use(apiTracer());

router.get("/get-route", (req, res) => {
  console.log("log: GET /get-route accessed");
  console.info("info: GET route running");
  console.debug("debug: Debugging info for GET");
  console.table(["table data", { method: "GET", route: "/get-route" }]);
  console.time("GET-time");
  res.send("GET route response");
  console.timeEnd("GET-time");
  res.status(200);
  console.log("User created", { id: 1 }, [10, 20]);
});

router.post("/post-route", (req, res) => {
  console.trace("trace: POST /post-route trace log");
  res.send("POST route response");
  res.status(201);
});

router.put("/put-route", (req, res) => {
  console.warn("warn: PUT /put-route hit!");
  res.send("PUT route response");
  res.status(301);
});

router.patch("/patch-route", (req, res) => {
  console.error("error: PATCH /patch-route triggered (example)");
  res.send("PATCH route response");
  res.status(101);
});

router.delete("/delete-route", (req, res) => {
  console.log({ key: "this is key", value: 23 });
  res.send("DELETE route response");
  res.status(201);
});

module.exports = router;
