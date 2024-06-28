import { PhoneControls } from "./phoneControls";

const myCanvas = document.getElementById('phoneCanvas') as HTMLCanvasElement;
const ctx = myCanvas.getContext('2d')!;

let rotation = Math.PI / 4;
animate();
const controls = new PhoneControls()

function animate() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    rotation+=.1;
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
    requestAnimationFrame(animate);
}

