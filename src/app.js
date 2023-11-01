require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const authRoute = require("./route/auth-router");
const vendorRoute = require("./route/vendor-route");
const notFound = require("./middlewares/not-found");
const error = require("./middlewares/error");
const session = require("express-session");
const passport = require("passport");
const PORT = process.env.PORT || "5001";
require("./auth");

const app = express();

app.use(cors());

app.use(express.json());
app.use(morgan("dev"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());


app.use("/", authRoute);
app.use("/vendor", vendorRoute);
// app.use('/admin',adminRoute)

// app.use(notFound);
// app.use(error);

app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
