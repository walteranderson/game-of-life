import './style.css'

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const LOOP_DELAY = 50;

const canvas = document.getElementById('app');
if (!canvas) throw Error('canvas not found');
const ctx = canvas.getContext('2d');
if (!ctx) throw Error('canvas context not found');
const scale = window.devicePixelRatio;
canvas.width = CANVAS_WIDTH * scale;
canvas.height = CANVAS_HEIGHT * scale;
ctx.scale(scale, scale);

const patternSelector = document.querySelector('#pattern');
patternSelector.addEventListener('change', reset);

let intervalRef;
let current = init(patternSelector.value);
draw();

function draw() {
	drawCells(current);
	drawGrid();
}

function next() {
	const newCurrent = update(current);
	current = newCurrent;
	draw();
}

function reset() {
	current = init(patternSelector.value);
	draw();
	stop();
}

function start() {
	intervalRef = setInterval(next, LOOP_DELAY);
}

function stop() {
	clearInterval(intervalRef);
	intervalRef = null;
}

window.addEventListener('keydown', (e) => {
	switch(e.key) {
		case 'ArrowRight':
			next();
			break;
		case 'ArrowLeft':
			reset();
			break;
		case ' ':
			if (intervalRef) {
				stop();
			} else {
				start();
			}
			break;
	}
});

function update(prev) {
	const cells = window.structuredClone(prev);
	for (let y = 0; y < CANVAS_HEIGHT / 10; y++) {
		for (let x = 0; x < CANVAS_WIDTH / 10; x++) {
			let alive = !!prev[x][y];
			let neighbors = getNeighborCount(prev, x, y);
			// Any live cell with fewer than two live neighbours dies, as if by underpopulation.
			if (alive && neighbors < 2) {
				cells[x][y] = 0;
				// console.log('dead - underpopulation', { x, y, neighbors })
			}
			// Any live cell with two or three live neighbors lives on to the next generation.
			else if (alive && (neighbors === 2 || neighbors === 3)) {
				cells[x][y] = 1;
				// console.log('liveon - 2 or 3 neighbors', { x, y, neighbors })
			}
			// Any live cell with more than three live neighbors dies, as if by overpopulation.
			else if (alive && neighbors > 3) {
				cells[x][y] = 0;
				// console.log('dead - overpop', { x, y, neighbors })
			}
			// Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
			else if (!alive && neighbors === 3) {
				cells[x][y] = 1;
				// console.log('live - reprod', { x, y, neighbors })
			}
		}
	}
	return cells;
}

function getNeighborCount(cells, x, y) {
	const get = (x, y) => (cells[x]?.[y]) ?? 0;
	return [
		get(x-1, y),
		get(x+1, y),
		get(x, y-1),
		get(x, y+1),
		get(x-1, y-1),
		get(x+1, y-1),
		get(x-1, y+1),
		get(x+1, y+1),
	].filter(Boolean).length;
}


function glider(cells) {
	cells[2][4] = 1;
	cells[3][2] = 1;
	cells[3][4] = 1;
	cells[4][3] = 1;
	cells[4][4] = 1;
}

function gliderGun(cells) {
	cells[10][10] = 1;
	cells[9][10] = 1;
	cells[9][9] = 1;
	cells[10][9] = 1;

	cells[19][9] = 1;
	cells[19][10] = 1;
	cells[19][11] = 1;
	cells[20][8] = 1;
	cells[20][12] = 1;
	cells[21][7] = 1;
	cells[21][13] = 1;
	cells[22][7] = 1;
	cells[22][13] = 1;

	cells[23][10] = 1;
	cells[25][10] = 1;
	cells[26][10] = 1;
	cells[25][9] = 1;
	cells[25][11] = 1;
	cells[24][8] = 1;
	cells[24][12] = 1;

	cells[29][9] = 1;
	cells[29][8] = 1;
	cells[29][7] = 1;
	cells[30][9] = 1;
	cells[30][8] = 1;
	cells[30][7] = 1;
	cells[31][6] = 1;
	cells[31][10] = 1;

	cells[33][10] = 1;
	cells[33][11] = 1;
	cells[33][6] = 1;
	cells[33][5] = 1;

	cells[43][7] = 1;
	cells[44][7] = 1;
	cells[43][8] = 1;
	cells[44][8] = 1;
}

function init(shape) {
	let cells = [];
	for (let y = 0; y < CANVAS_HEIGHT / 10; y++) {
		for (let x = 0; x < CANVAS_WIDTH / 10; x++) {
			if (!cells[x]) cells[x] = [];
			cells[x][y] = 0;
		}
	}

	switch(shape) {
		case 'glider':
			glider(cells);
			break;
		case 'glider-gun':
			gliderGun(cells);
			break;
	}

	return cells;
}

function drawCells(cells) {
	for (let y = 0; y < CANVAS_HEIGHT / 10; y++) {
		for (let x = 0; x < CANVAS_WIDTH / 10; x++) {
			if (cells[x][y]) {
				drawCell(x, y);
			} else {
				emptyCell(x, y);
			}
		}
	}
}

function drawCell(x, y) {
	ctx.fillStyle = 'white';
	ctx.fillRect(x*10, y*10, 10, 10);
}

function emptyCell(x, y) {
	ctx.clearRect(x*10, y*10, 10, 10);
}

function drawGrid() {
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
	ctx.lineWidth = 0.5;
	for (let x = 10; x < CANVAS_WIDTH; x += 10) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, CANVAS_HEIGHT);
		ctx.stroke();
	}
	for (let y = 10; y <= CANVAS_WIDTH; y += 10) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(CANVAS_WIDTH, y);
		ctx.stroke();
	}
}
