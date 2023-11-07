require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const authRoute = require("./route/auth-router");
const vendorRoute = require("./route/vendor-route");
const testRoute = require("./route/test");
const adminRoute = require("./route/admin-route");
const notFoundMiddleware = require("./middlewares/not-founded");
const errorMiddleware = require("./middlewares/error");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const mobileFormat = require("./utils/mobileFormat");
const PORT = process.env.PORT || "5000";
const FRONT_URL = process.env.FRONT_URL || "http://localhost:5173";
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONT_URL,
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// socket.io >>>>>>>>>>>>>>>>>>
io.on("connect", (socket) => {
  console.log(`>User<: ${socket.id} connected`);
  socket.on("create_room", (roomInfo) => {
    socket.join(roomInfo);
  });

  socket.on("join_room", (roomInfo) => {
    socket.join(roomInfo);
  });

  socket.on("booking", (bookingInfo) => {
    io.to(`${bookingInfo.shopName}`).emit(
      "check_queue",
      // (mocking) DB_reservation
      {
        data: "Check Queue",
        id: bookingInfo.userId,
        name: bookingInfo.name,
        queueNumber: "",
        date: dayjs().format("DD MMMM YYYY"),
        time: dayjs().format("h:mm A"),
      }
    );
  });

  socket.on("confirm_booking", (bookingInfo) => {
    console.log(bookingInfo);
  });
  // socket.on("booking", (bookingInfo) => {
  //   io.to(`${bookingInfo.userId}`)
  //     .to(`${bookingInfo.shopName}`)
  //     .emit(
  //       "ticket",
  //       // (mocking) DB_reservation
  //       {
  //         data: "Online Queue Detail",
  //         id: bookingInfo.userId,
  //         name: bookingInfo.name,
  //         queueNumber: 2,
  //         date: dayjs().format("DD MMMM YYYY"),
  //         time: dayjs().format("h:mm A"),
  //       }
  //     );
  // });

  socket.on("booking_for_customer", (onstieData) => {
    io.to(`${onstieData.shopName}`).emit(
      "onsite_queue",
      // (mocking) DB_reservation
      {
        data: "Onsite Queue",
        id: onstieData.userId,
        name: onstieData.name,
        mobile: mobileFormat(onstieData.mobile),
        queueNumber: "",
        date: dayjs().format("DD MMMM YYYY"),
        time: dayjs().format("h:mm A"),
      }
    );
  });

  //!!cancel booking and delete DB_reservation
  socket.on("cancel", (cancelInfo) => {
    io.to(`${cancelInfo.shopName}`).emit("cancel_queue", {
      userId: cancelInfo.userId,
    });
  });

  //disconnect status
  socket.on("disconnect", () => {
    console.log(socket.id, "disconnected");
  });
});
// socket.io >>>>>>>>>>>>>>>>>>

app.use("/auth", authRoute);
app.use("/vendor", vendorRoute);
app.use("/test", testRoute);
app.use("/admin", adminRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

server.listen(PORT, () => console.log(`server running on port: ${PORT}`));
