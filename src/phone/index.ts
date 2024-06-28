const myCanvas = document.getElementById('phoneCanvas') as HTMLCanvasElement;
const ctx = myCanvas.getContext('2d')!;

const rotation = Math.PI / 4;

ctx.beginPath();
ctx.ellipse(
    myCanvas.width / 2,
    myCanvas.height / 2,
    100,
    50,
    rotation,
    0,
    Math.PI * 2
);
ctx.stroke();