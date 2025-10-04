# 🧠 Project Overview  
## System-Wide API Status Monitoring Dashboard  

The **API Status Monitoring Dashboard** is a full-stack web application that provides real-time visibility into the health and performance of multiple APIs within a system. It helps developers and administrators track uptime, response codes, performance metrics, and error trends through an interactive and visually rich dashboard.

---

## 🎯 Purpose  

The main goal of this application is to **monitor APIs system-wide** with clear visual indicators, enabling teams to:  

- Detect outages or degraded performance early.  
- Analyze historical uptime trends.  
- Review API performance metrics such as average response time, error rate, and total request volume.  
- Configure rate limits, request schedules, and logging behavior per API dynamically.  

---

## ⚡ Key Features  

### 🔸 System-Wide API Status Overview  
Displays all monitored APIs with color-coded indicators:  
- 🟩 **Green:** 200 OK  
- 🟧 **Orange:** 3xx Redirect  
- 🟨 **Yellow:** 1xx Informational  
- 🟥 **Red:** 4xx/5xx Error  

---

### 🔸 Quick Stats Section  
Summarizes essential metrics:  
- Total Request Volume  
- Average Response Time  
- Uptime Percentage  
- Error Rate  
- Most Common Error Code  
- Last Downtime Timestamp  

---

### 🔸 Time Range Selector  
Filter API performance data across a specific date range.  

---

### 🔸 Graph Visualization  
Displays a **Line Chart** visualizing uptime trends over time using Chart.js.  

---

### 🔸 Configurable API Parameters  
Admins can dynamically define and update monitoring parameters for each API, including:  

- **Scheduling (Start/End Time):**  
  Specify when the API should be actively monitored.  
  APIs outside the defined schedule automatically disable requests during off-hours.  

- **Request Limit & Rate:**  
  Set a maximum number of requests per defined time window (per second, hour, or day) to prevent overloading and maintain stability.  

- **Tracer Log Control:**  
  Toggle the tracer logging feature **on/off** to decide whether console log capturing should be enabled for that API.  

- **API Visibility Control:**  
  Turn monitoring **on/off** to decide whether the API’s status should appear on the main dashboard.  

---

### 🔸 Secure Logging via Tracer Middleware  
Each request log includes:  
- API name, status code, response time, and timestamp  
- Captured console outputs (`log`, `warn`, `error`, `info`)  
- Sent securely to a private tracer API with `x-api-key` authentication  

---

# 🧩 How to Use the Custom `apiTracer` Middleware  

The **`apiTracer`** middleware allows any Express backend to automatically **capture console logs**, **measure API response times**, and **send real-time status data** to the central monitoring system.  

---

## 🔹 Installation Steps  

Before using the middleware, make sure you have **`axios`** and **`express-rate-limit`** installed:  

```bash
npm install axios express-rate-limit
```

---

### **1️⃣ Copy the Middleware File**  

Copy `apiTracerMiddleware.js` into your project under:  

```
/middleware/apiTracerMiddleware.js
```

> ⚠️ Make sure to install **axios** and **express-rate-limit** before using the middleware.

---

### **2️⃣ Add the Middleware Code**

```js
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

const url = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

const apiTracer = () => {
  const rateLimiters = {};

  return async (req, res, next) => {
    const start = Date.now();
    const apiName = req.originalUrl.split("?")[0].split("/")[2];

    // Buffer for this request's logs
    const consoleBuffer = [];
    // Override console methods
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
          // Fallback in case JSON.stringify fails
          originalConsole.error("Console buffer error:", e.message);
        }
        // Use original console (safe reference)
        originalConsole[method](...args);
      };
    });

    // Fetch config for this API
    let configData;
    try {
      const response = await axios.get(`${url}/api/config/${apiName}`);
      configData = response.data;
    } catch (err) {
      console.error("Config get failed:", err.message);
    }

    // If no config exists, create one
    if (!configData) {
      try {
        const response = await axios.post(
          `${url}/api/config`,
          {
            apiName,
            startDate: new Date(),
          },
          {
            headers: {
              "x-api-key": API_KEY,
            },
          }
        );
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
        // Only post logs if tracerDisabled is false
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
            await axios.post(`${url}/api/log`, logDataPayload, {
              headers: {
                "x-api-key": API_KEY,
              },
            });
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
```

---

### **3️⃣ Use It in Your Express App**

```js
const express = require("express");
const cors = require("cors");
const apiTracer = require("./middleware/apiTracerMiddleware");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Use the apiTracer middleware
app.use(apiTracer());

// Your API routes
const logRoutes = require("./routes/logRoutes");
const configRoutes = require("./routes/configRoutes");

app.use("/api/log", logRoutes);
app.use("/api/config", configRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
```

---

### **4️⃣ Configure Environment Variables**

```env
API_KEY=secret123
BASE_URL=https://api-status-monitoring-system.onrender.com
```

> These values are used by the middleware to securely communicate with the monitoring server.

---

### **5️⃣ Start Your Backend**

```bash
npm start
```

Every request to your backend will now be **traced**, **logged**, and **sent** to your central monitoring dashboard 🎯  
