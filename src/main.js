import './style.css';

const canvas = document.getElementById('app');
if (!canvas) throw Error('canvas not found');

const ctx = canvas.getContext('2d');
if (!ctx) throw Error('canvas context not found');

const Camera = {
	MAX_ZOOM: 5,
	MIN_ZOOM: 1,
	ZOOM_SENS: 0.005,
	isDragging: false,
	zoomLevel: 2,
	offset: {
		x: window.innerWidth * window.devicePixelRatio / 2,
		y: window.innerHeight * window.devicePixelRatio / 2,
	},
	dragStart: {
		x: -1,
		y: -1,
	},
	reset() {
		Camera.offset.x = window.innerWidth * window.devicePixelRatio / 2;
		Camera.offset.y = window.innerHeight * window.devicePixelRatio / 2;
	},
	init() {
		canvas.addEventListener('mousedown', (e) => {
			Camera.isDragging = true;
			Camera.dragStart = {
				x: e.clientX / Camera.zoomLevel - Camera.offset.x,
				y: e.clientY / Camera.zoomLevel - Camera.offset.y,
			};
		});
		canvas.addEventListener('mouseup', () => {
			Camera.isDragging = false;
			Camera.dragStart = { x: -1, y: -1 };
		});
		canvas.addEventListener('mouseleave', () => {
			Camera.isDragging = false;
			Camera.dragStart = { x: -1, y: -1 };
		});
		canvas.addEventListener('mousemove', (e) => {
			if (Camera.isDragging) {
				Camera.offset.x = e.clientX / Camera.zoomLevel - Camera.dragStart.x;
				Camera.offset.y = e.clientY / Camera.zoomLevel - Camera.dragStart.y;
			}
		});
		canvas.addEventListener('wheel', (e) => {
			if (Camera.isDragging) {
				return;
			}
			Camera.zoomLevel += -(e.deltaY * Camera.ZOOM_SENS);
			Camera.zoomLevel = Math.min(Camera.zoomLevel, Camera.MAX_ZOOM);
			Camera.zoomLevel = Math.max(Camera.zoomLevel, Camera.MIN_ZOOM);
		});
		window.addEventListener('resize', () => {
			Camera.reset();
			draw();
		});
	}
};

const Grid = {
	WIDTH: 80,
	HEIGHT: 80,
	draw() {
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
		ctx.lineWidth = 0.5;

		// place a dot at 0,0
		ctx.fillRect(-0.5, -0.5, 1, 1);

		for (let x = 0; x <= Grid.WIDTH; x += 10) {
			ctx.beginPath();
			ctx.moveTo(x, -Grid.WIDTH);
			ctx.lineTo(x, Grid.WIDTH);
			ctx.stroke();
			if (x > 0) {
				ctx.beginPath();
				ctx.moveTo(-x, -Grid.WIDTH);
				ctx.lineTo(-x, Grid.WIDTH);
				ctx.stroke();
			}
		}

		for (let y = 0; y <= Grid.HEIGHT; y += 10) {
			ctx.beginPath();
			ctx.moveTo(-Grid.HEIGHT, y);
			ctx.lineTo(Grid.HEIGHT, y);
			ctx.stroke();
			if (y > 0) {
				ctx.beginPath();
				ctx.moveTo(-Grid.HEIGHT, -y);
				ctx.lineTo(Grid.HEIGHT, -y);
				ctx.stroke();
			}
		}
	}
};

const Cells = {
	current: [
		[0, 3],
		[1, 3],
		[2, 3],
		[1, 1],
		[2, 2],
	],
	draw() {
		for (let i = 0; i < Cells.current.length; i++) {
			const [x, y] = Cells.current[i];
			ctx.fillStyle = 'white';
			ctx.fillRect(x * 10, y * 10, 10, 10);
		}
	}
};

window.addEventListener('keydown', (e) => {
	switch (e.key) {
		case 'ArrowRight':
			update();
			break;
		case 'ArrowLeft':
			// reset();
			break;
		case ' ':
			// if (intervalRef) {
			// 	stop();
			// } else {
			// 	start();
			// }
			break;
	}
});

function update() {
	for (let i = 0; i < Grid.WIDTH * Grid.HEIGHT; i++) {
		const x = (i % Grid.WIDTH) - Math.floor(Grid.WIDTH / 2);
		const y = Math.floor(i / Grid.WIDTH) - Math.floor(Grid.HEIGHT / 2);
		console.log({ x, y });
	}
}

function draw() {
	canvas.width = window.innerWidth * window.devicePixelRatio;
	canvas.height = window.innerHeight * window.devicePixelRatio;
	const scale = window.devicePixelRatio * Camera.zoomLevel;
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.scale(scale, scale);
	ctx.translate(-canvas.width / 2 + Camera.offset.x, -canvas.height / 2 + Camera.offset.y);
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	// -----
	Cells.draw();
	Grid.draw();
	requestAnimationFrame(draw);
}

Camera.init();
draw();
