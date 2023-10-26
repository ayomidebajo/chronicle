const {io} = require("socket.io-client");

const socket = io("http://127.0.0.1:8000");

socket.on("connect", () => {
    console.log("Socket is connected");
});

socket.emit("watch", ["RPM", "SPEED"]);

socket.on("watch", (val) => {
    console.log(val);
});

