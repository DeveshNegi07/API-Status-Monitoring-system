const rateLimit = require("express-rate-limit");
const axios = require("axios");

const methods = [
  "log",
  "error",
  "warn",
  "info",
  "trace",
  "debug",
  "table",
  "time",
  "timeEnd",
];
const originalConsole = {};
// Backup original console methods
methods.forEach((method) => {
  originalConsole[method] = console[method];
});

const apiTracer = () => {
  const rateLimiters = {};

  return async (req, res, next) => {
    const start = Date.now();
    const apiName = req.originalUrl.split("?")[0].split("/")[2];

    // Buffer for this request's logs
    const consoleBuffer = [];
    //override console methods
    methods.forEach((method) => {
      console[method] = (...args) => {
        try {
          consoleBuffer.push({
            timestamp: new Date(),
            consoleType: method,
            message: args
              .map((arg) =>
                typeof arg === "object" ? JSON.stringify(arg) : String(arg)
              )
              .join(" "),
          });
        } catch (e) {
          // fallback in case JSON.stringify fails
          originalConsole.error("Console buffer error:", e.message);
        }
        // Use original console (safe reference)
        originalConsole[method](...args);
      };
    });

    // Fetch config for this API
    let configData;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/config/${apiName}`
      );
      configData = response.data;
    } catch (err) {
      console.error("Config get failed:", err.message);
    }

    // If no config exists, create one
    if (!configData) {
      try {
        const response = await axios.post("http://localhost:5000/api/config", {
          apiName,
          startDate: new Date(),
        });
        configData = response.data;
      } catch (err) {
        console.error("Config create failed:", err.message);
      }
    }

    // Schedule on/off logic
    if (configData && configData.scheduleOnOffEnabled) {
      const now = new Date();
      const [startHour, startMin] = configData.onOffTime.startTime
        .split(":")
        .map(Number);
      const [endHour, endMin] = configData.onOffTime.endTime
        .split(":")
        .map(Number);
      const startTime = new Date(now);
      startTime.setHours(startHour, startMin, 0, 0);
      const endTime = new Date(now);
      endTime.setHours(endHour, endMin, 0, 0);

      if (now < startTime || now > endTime) {
        // Restore original console methods before ending request
        methods.forEach((method) => {
          console[method] = originalConsole[method];
        });
        return res
          .status(403)
          .send("API requests disabled during this scheduled off time");
      }
    }

    // Rate limiting logic
    if (
      configData &&
      configData.requestLimitEnabled &&
      configData.limit.requestNumber > 0
    ) {
      let windowMs = 1000; // default 1 second
      if (configData.limit.rate === "sec") windowMs = 1000;
      else if (configData.limit.rate === "hour") windowMs = 60 * 60 * 1000;
      else if (configData.limit.rate === "day") windowMs = 24 * 60 * 60 * 1000;

      // Check if limiter exists and config version matches
      if (
        !rateLimiters[apiName] ||
        rateLimiters[apiName].configVersion !== configData.updatedAt
      ) {
        // Create new limiter with the latest config
        rateLimiters[apiName] = rateLimit({
          windowMs,
          max: configData.limit.requestNumber,
          standardHeaders: true,
          legacyHeaders: false,
          message: "Too many requests, please try again later.",
        });
        rateLimiters[apiName].configVersion = configData.updatedAt;
      }

      // Use rate limiter middleware for this request
      return rateLimiters[apiName](req, res, async () => {
        await tracerAndNext();
      });
    }

    // If not rate limiting, just trace and continue
    await tracerAndNext();

    async function tracerAndNext() {
      res.on("finish", async () => {
        // Only post logs if tracerDisabled is true
        if (configData && configData.tracerDisabled === false) {
          const logDataPayload = {
            apiName,
            statusCode: res.statusCode,
            responseTime: Date.now() - start,
            httpMethod: req.method,
            endpoint: req.originalUrl,
            timestamp: new Date(),
            consoleData: consoleBuffer,
          };
          try {
            await axios.post("http://localhost:5000/api/log", logDataPayload);
          } catch (err) {
            originalConsole.error("Tracer send failed:", err.message);
          }
        }
        // Restore original console methods after request finished
        methods.forEach((method) => {
          console[method] = originalConsole[method];
        });
      });
      next();
    }
  };
};

module.exports = apiTracer;
