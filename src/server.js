const server = require("./app");
const { Server } = require("socket.io");
const FRONT_URL = process.env.FRONT_URL || "http://localhost:5173";
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const mobileFormat = require("./utils/mobileFormat");

const io = new Server(server, {
  cors: {
    origin: FRONT_URL,
    methods: ["GET", "POST"],
  },
});

// socket.io >>>>>>>>>>>>>>>>>>
io.on("connect", (socket) => {
  console.log(`>User<: ${socket.id} connected`);
  socket.on("create_room", (roomInfo) => {
    socket.join(roomInfo);
  });

  socket.on("join_room", (roomInfo, id) => {
    console.log(roomInfo);
    socket.join(roomInfo);
  });

  socket.on("booking", ({ bookingInfo }) => {
    console.log(bookingInfo);

    socket.to(`${bookingInfo.shopName}`).emit(
      "check_queue",
      // (mocking) DB_reservation
      {
        data: "Check Queue",
        userId: bookingInfo.userId,
        name: bookingInfo.name,
        queueNumber: "",
        socket: socket.id,
        date: dayjs().format("DD MMMM YYYY"),
        time: dayjs().format("h:mm A"),
      }
    );
  });

  socket.on("get_queue", (bookingConfirm) => {
    console.log(bookingConfirm);
    socket.to(bookingConfirm.socket).emit("ticket", bookingConfirm);
  });

  socket.on("confirm_booking", (bookingConfirm) => {
    console.log(bookingConfirm);
    socket.to(bookingConfirm.socket).emit("ticket", bookingConfirm);
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

const PORT = process.env.PORT || "5000";
server.listen(PORT, () => console.log(`server running on port: ${PORT}`));
