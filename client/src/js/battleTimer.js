let running = false;
let interval;
let decimal = 0;
let sec = 0;
let min = 0;
let cs = 0;
let decimalOut = document.getElementById("decimal");
let secOut = document.getElementById("sec");
let minOut = document.getElementById("min");
let colon = document.getElementById("colon");
let timesOut = document.getElementById("timeOut");
let clearAll = document.getElementById("clear");
let timesDisplay = new Array();
let csTimes = new Array();
let avAll = 0;
let avAllOut = document.getElementById("overallAv");
let best = 999999999999999999;
let bestOut = document.getElementById("fastest");
let worstOut = document.getElementById("worst");
let worst = 0;
let numSolves = 0;
let total = 0;
let numSolvesOut = document.getElementById("solveNum");
generateScramble();

function timer() {
	decimal++;
	cs++; //counts time in centiseconds
	decimalOut.innerHTML = decimal;
	if (decimal >= 100) {
		decimal = 0;
		sec++;

		if (sec > 59) {
			sec = 0;
			min++;
			colon.innerHTML = ":";
			minOut.innerHTML = min;
		}
		if (sec <= 9 && min > 0) {
			sec = "0" + sec;
		}
		secOut.innerHTML = sec;
	}

	if (decimal <= 9) {
		decimal = "0" + decimal;
		decimalOut.innerHTML = decimal;
	}
}

window.onkeyup = run;

function run() {
	if (!running) {
		generateScramble();
		decimal = 0;
		sec = 0;
		min = 0;
		cs = 0;
		secOut.innerHTML = "0";
		minOut.innerHTML = "";
		colon.innerHTML = "";
		running = true;
		scramble = "";
		interval = setInterval(timer, 10);
		timesOut.style.color = "green";
	} else if (running) {
		running = false;
		timesOut.style.color = "#1e2125";
		clearInterval(interval);
		timesDisplay.push(" " + timesOut.innerHTML);
		csTimes.push(cs);
		calculateStats();
	}
}

function generateScramble() {
	let move; //includes face to turn and how to turn it. Ex. 2F
	let face; //Face to turn. Either R, L, F, B, U, or D
	let faceNum; //1-6, corresponds to face R-D
	let lastFaceNum = 10; //The face of the previous turn
	let turn; //How to turn a face. Either ', 2, or nothing.
	let scramble = ""; //inlucdes 25 moves
	let output = document.getElementById("scram");
	for (let x = 0; x < 25; x++) {
		do {
			faceNum = Math.floor(Math.random() * 6) + 1;
		} while (faceNum === lastFaceNum); //the same face can't appear in consecutive moves.
		lastFaceNum = faceNum;
		if (faceNum === 1) {
			face = "R";
		}
		if (faceNum === 2) {
			face = "L";
		}
		if (faceNum === 3) {
			face = "U";
		}
		if (faceNum === 4) {
			face = "D";
		}
		if (faceNum === 5) {
			face = "F";
		}
		if (faceNum === 6) {
			face = "B";
		}
		turn = Math.floor(Math.random() * 3) + 1;
		if (turn === 1) {
			move = face;
		}
		if (turn === 2) {
			move = face + "2";
		}
		if (turn === 3) {
			move = face + "'";
		}

		scramble += move + " ";
	}
	output.innerHTML = scramble;
}
clearAll.onclick = clearTimes;

function clearTimes() {
	numSolves = 0;
	numSolvesOut.innerHTML = "Solves: " + numSolves;
	best = 99999999999;
	bestOut.innerHTML = "Best: 0";
	worstOut.innerHTML = "Worst: 0";
	worst = 0;
	avAll = 0;
	total = 0;
	avAllOut.innerHTML = "Average: 0";
	timesDisplay = [];
	csTimes = [];
}

function calculateStats() {
	numSolves++;
	total = 0;
	numSolvesOut.innerHTML = "Solves: " + numSolves;
	for (let x = 0; x < csTimes.length; x++) {
		if (csTimes[x] < best) {
			best = csTimes[x];
		}
		if (csTimes[x] > worst) {
			worst = csTimes[x];
		}
		total += csTimes[x];
	}
	avAll = total / numSolves;
	avAllOut.innerHTML = "Average: " + formatTime(avAll);
	bestOut.innerHTML = "Best: " + formatTime(best);
	worstOut.innerHTML = "Worst: " + formatTime(worst);
}

function formatTime(t) {
	let m = 0,
		s = 0,
		c = 0,
		out = "";
	m = Math.floor(t / 6000);
	t = t % 6000;
	s = Math.floor(t / 100);
	t = t % 100;
	c = Math.floor(t);
	if (m < 1) {
		m = "";
	} else {
		m = m + ":";
		if (s < 10) {
			s = "0" + s;
		}
	}
	if (c < 10) {
		c = "0" + c;
	}

	out = "" + m + s + "." + c;
	return out;
}
