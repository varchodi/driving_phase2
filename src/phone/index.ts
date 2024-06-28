import { PhoneControls } from "./phoneControls";

const myCanvas = document.getElementById('phoneCanvas') as HTMLCanvasElement;
const ctx = myCanvas.getContext('2d')!;
let rotation = 0;
const controls = new PhoneControls(myCanvas)
animate();
function animate() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
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

    myCanvas.onclick=(e:MouseEvent)=>console.log("touched")
}

