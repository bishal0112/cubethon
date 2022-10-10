const path = require("path");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { makeid } = require("./utils/utils");
const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
} = require("./utils/users");

const {
	registerUsers,
	signinUsers,
	getTimer,
} = require("./routes/database.routes");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Use Session
app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true,
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "../client/src")));
const botName = "Cubethon Bot";

// Run when client connects
io.on("connection", (socket) => {
	socket.on("joinRoom", ({ username, room }) => {
		const user = userJoin(socket.id, username, room);
		socket.join(user.room);

		// Welcome current user
		socket.emit("message", formatMessage(botName, "Welcome to Cubethon.."));

		// Broadcast when a user connects
		socket.broadcast
			.to(user.room)
			.emit(
				"message",
				formatMessage(botName, `${user.username} has joined the chat`),
			);

		// Send users and room info
		io.to(user.room).emit("roomUsers", {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});

	// Listen for chatMessage
	socket.on("chatMessage", (msg) => {
		const user = getCurrentUser(socket.id);

		io.to(user.room).emit("message", formatMessage(user.username, msg));
	});

	// Runs when client disconnects
	socket.on("disconnect", () => {
		const user = userLeave(socket.id);
		if (user) {
			io.to(user.room).emit(
				"message",
				formatMessage(botName, `${user.username} has left the chat`),
			);
			io.to(user.room).emit("roomUsers", {
				room: user.room,
				users: getRoomUsers(user.room),
			});
		}
	});

	// for new game
	socket.on("newGame", handleNewGame);

	function handleNewGame() {
		let roomName = makeid(5);
		socket.emit("gameCode", roomName);
	}

	// video chat code
	socket.on("create or join", (room) => {
		console.log("create or join to room", room);
		let arr = Array.from(io.sockets.adapter.rooms);
		let filtered = arr.filter((room) => !room[1].has(room[0]));
		let res = filtered.map((i) => i[0]);
		const myRoom = res || { length: 0 };
		const numClients = myRoom.length;
		console.log(room, "has", numClients, "clients");

		if (numClients == 0) {
			socket.join(room);
			socket.emit("created", room);
		} else if (numClients == 1) {
			socket.join(room);
			socket.emit("joined", room);
		} else {
			socket.emit("full", room);
		}
	});

	socket.on("ready", (room) => {
		socket.broadcast.to(room).emit("ready");
	});

	socket.on("candidate", (event) => {
		socket.broadcast.to(event.room).emit("candidate", event);
	});

	socket.on("offer", (event) => {
		socket.broadcast.to(event.room).emit("offer", event.sdp);
	});
	socket.on("answer", (event) => {
		socket.broadcast.to(event.room).emit("answer", event.sdp);
	});
});

// Routes Here
app.post("/register", registerUsers());
app.post("/signin", signinUsers());
app.get("/pages/timer.html", getTimer());

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
