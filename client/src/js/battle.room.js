// const socket = io("https://sleepy-island-33889.herokuapp.com/");

// socket.on("unknownCode", handleUnknownCode);
// socket.on("tooManyPlayers", handleTooManyPlayers);

const navBar = document.getElementById("nav-bar");
const battleSection = document.getElementById("battleSection");
const initialScreen = document.getElementById("initialScreen");
const initialScreen1 = document.getElementById("initialScreen1");
const initialScreen2 = document.getElementById("initialScreen2");
const newGameBtn = document.getElementById("newGameButton");
const joinGameBtn = document.getElementById("joinGameButton");
let gameCodeDisplay = document.getElementById("gameCodeDisplay");
let gameCodeInput = document.getElementById("gameCodeInput");
const gameScreen = document.getElementById("gameScreen");
let localVideo = document.getElementById("localVideo");
let remoteVideo = document.getElementById("remoteVideo");

let roomNumber, localStream, remoteStream, rtcPeerConnection, isCaller;

newGameBtn.addEventListener("click", newGame);
joinGameBtn.addEventListener("click", joinGame);

const iceServers = {
	iceServer: [
		{ urls: "stun:stun.services.mozilla.com" },
		{ urls: "stun:stun.l.google.com:19302" },
	],
};

const streamConstraints = {
	audio: true,
	video: true,
};

const socket = io();

socket.on("gameCode", handleGameCode);

function newGame() {
	socket.emit("newGame");
	setTimeout(function startGame() {
		roomNumber = gameCodeDisplay.innerText;
		console.log(roomNumber);
		socket.emit("create or join", roomNumber);
		battleSection.style = "display: none";
		navBar.style = "display: none";
		gameScreen.style = "display: block";
	}, 1500);
}

function joinGame() {
	if (gameCodeInput.value === "") {
		alert("Please Type a room name");
	} else {
		roomNumber = gameCodeInput.value;
		console.log(roomNumber);
		socket.emit("create or join", roomNumber);
		gameCodeDisplay.innerText = roomNumber;
		battleSection.style = "display: none";
		navBar.style = "display: none";
		gameScreen.style = "display: block";
	}
}

function handleGameCode(gameCode) {
	gameCodeDisplay.innerText = gameCode;
}

socket.on("created", (room) => {
	navigator.mediaDevices
		.getUserMedia(streamConstraints)
		.then((stream) => {
			localStream = stream;
			localVideo.srcObject = stream;
			isCaller = true;
		})
		.catch((err) => {
			console.log("An error occured", err);
		});
});

socket.on("joined", (room) => {
	navigator.mediaDevices
		.getUserMedia(streamConstraints)
		.then((stream) => {
			localStream = stream;
			localVideo.srcObject = stream;
			socket.emit("ready", roomNumber);
		})
		.catch((err) => {
			console.log("An error occured", err);
		});
});

socket.on("full", (room) => {
	console.log(`Room With ID: ${room} is full.`);
});

socket.on("ready", () => {
	if (isCaller) {
		rtcPeerConnection = new RTCPeerConnection(iceServers);
		rtcPeerConnection.onicecandidate = onIceCandidate;
		rtcPeerConnection.ontrack = onAddStream;
		rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream);
		rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream);
		rtcPeerConnection
			.createOffer()
			.then((sessionDescription) => {
				rtcPeerConnection.setLocalDescription(sessionDescription);
				socket.emit("offer", {
					type: "offer",
					sdp: sessionDescription,
					room: roomNumber,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
});

socket.on("offer", (event) => {
	if (!isCaller) {
		rtcPeerConnection = new RTCPeerConnection(iceServers);
		rtcPeerConnection.onicecandidate = onIceCandidate;
		rtcPeerConnection.ontrack = onAddStream;
		rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream);
		rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream);
		rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
		rtcPeerConnection
			.createAnswer()
			.then((sessionDescription) => {
				rtcPeerConnection.setLocalDescription(sessionDescription);
				socket.emit("answer", {
					type: "answer",
					sdp: sessionDescription,
					room: roomNumber,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
});

socket.on("answer", (event) => {
	rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
});

socket.on("candidate", (event) => {
	const candidate = new RTCIceCandidate({
		sdpMLineIndex: event.label,
		candidate: event.candidate,
	});
	rtcPeerConnection.addIceCandidate(candidate);
});

function onAddStream(event) {
	remoteVideo.srcObject = event.streams[0];
	remoteStream = event.streams[0];
}
function onIceCandidate(event) {
	if (event.candidate) {
		console.log("sending ice candidate", event.candidate);
		socket.emit("candidate", {
			type: "candidate",
			label: event.candidate.sdpMLineIndex,
			id: event.candidate.sdpMid,
			candidate: event.candidate.candidate,
			room: roomNumber,
		});
	}
}
