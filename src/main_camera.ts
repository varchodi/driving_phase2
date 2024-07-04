import { CameraControls } from "./cameraControls";
import { myCar } from "./race";

const ironManCanvas = document.getElementById("ironManCanvas") as HTMLCanvasElement;

const controls = new CameraControls(ironManCanvas);
myCar.controls = controls as any;