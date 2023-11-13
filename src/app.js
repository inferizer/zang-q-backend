require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const authRoute = require("./route/auth-router");
const vendorRoute = require("./route/vendor-route");
const testRoute = require("./route/test");
const adminRoute = require("./route/admin-route");
const userRoute = require("./route/user-route");
const notFoundMiddleware = require("./middlewares/not-founded");
const errorMiddleware = require("./middlewares/error");
const http = require("http");   
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRoute);
app.use("/vendor", vendorRoute);
app.use("/test", testRoute);
app.use("/admin", adminRoute);
app.use("/user", userRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = server;
