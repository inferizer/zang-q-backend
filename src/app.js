require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const authRoute = require("./route/auth-router");
const vendorRoute = require('./route/vendor-route')
const notFoundMiddleware = require("./middlewares/not-founded");
const errorMiddleware = require("./middlewares/error");
const PORT = process.env.PORT || "5000";


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRoute);
app.use("/vendor", vendorRoute);
// app.use('/admin',adminRoute)

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT,"192.168.0.58", () => console.log(`server running on port: ${PORT}`));
