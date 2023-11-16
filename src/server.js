const server = require("./app");
const { Server } = require("socket.io");
const FRONT_URL = process.env.FRONT_URL || "http://localhost:5173";
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const prisma = require("./models/prisma");
const delKeyObj = require("./utils/delKeyObj");
dayjs.extend(utc);

const io = new Server(server, {
  cors: {
    origin: FRONT_URL,
    methods: ["GET", "POST"],
  },
});

// socket.io >>>>>>>>>>>>>>>>>>
io.on("connect", (socket) => {
  console.log(`>User<: ${socket.id} connected`);
  // socket.on("create_room", (roomInfo) => {
  //   socket.join(roomInfo);
  // });

  socket.on("join_room", (roomInfo) => {
    socket.join(roomInfo);
  });

  socket.on("booking", ({ bookingInfo }, seat) => {
    const editBookingInfo = {
      name: bookingInfo.name,
      userId: bookingInfo.userId,
      shopId: bookingInfo.shopId,
      queueNumber: "",
      seat,
      type: bookingInfo.type,
      socket: bookingInfo.socket,
      date: dayjs().format("DD MMMM YYYY"),
      time: dayjs().format("h:mm A"),
    };

    socket.to(`${bookingInfo.shopId}`).emit("check_queue", editBookingInfo);
  });

  socket.on("booking_for_customer", ({ bookingInfo }, seat, name) => {
    const editBookingInfo = {
      name,
      shopId: bookingInfo.shopId,
      queueNumber: "",
      seat,
      type: bookingInfo.type,
      date: dayjs().format("DD MMMM YYYY"),
      time: dayjs().format("h:mm A"),
    };
    io.to(`${bookingInfo.shopId}`).emit("check_queue", editBookingInfo);
  });

  socket.on("confirm_booking", async (bookingConfirm) => {
    console.log(bookingConfirm);
    const editBookingConfirm = { ...bookingConfirm };
    keyToDel = ["name"];
    delKeyObj(editBookingConfirm, keyToDel);
    console.log(editBookingConfirm);
    const result = await prisma.resevations.create({
      data: editBookingConfirm,
    });
    const newBookingConfirm = { ...bookingConfirm, id: result.id };

    socket.to(bookingConfirm.socket).emit("ticket", newBookingConfirm);
  });

  // socket.on("booking_for_customer", (onstieData) => {
  //   // console.log(onstieData);
  //   io.to(`${onstieData.shopId}`).emit(
  //     "onsite_queue",
  //     // (mocking) DB_reservation
  //     {
  //       data: "Onsite Queue",
  //       name: onstieData.name,
  //       queueNumber: "",
  //       type: onstieData.type,
  //       date: dayjs().format("DD MMMM YYYY"),
  //       time: dayjs().format("h:mm A"),
  //     }
  //   );
  // });

  socket.on("vendor_cancel", (socket) => {
    console.log("test", socket);
    socket.to(socket).emit("cancel_ticket");
  });

  //!!cancel booking and delete DB_reservation
  socket.on("cancel", async (cancelInfo) => {
    io.to(`${cancelInfo.shopId}`).emit("cancel_queue", {
      userId: cancelInfo.userId,
    });
    await prisma.resevations.update({
      where: { id: cancelInfo.id },
      data: { status: "cancelled" },
    });
  });

  //disconnect status
  socket.on("disconnect", () => {
    console.log(socket.id, "disconnected");
  });
});
// socket.io >>>>>>>>>>>>>>>>>>

const PORT = process.env.PORT || "4000";
server.listen(PORT, () => console.log(`server running on port: ${PORT}`));
