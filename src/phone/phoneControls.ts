export class PhoneControls{
    public tilt: number;
    constructor(public canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.tilt = 0;
        this.addAdventListeners();
    }

    private addAdventListeners() {
        window.addEventListener('deviceorientation', (e: DeviceOrientationEvent) => {
            this.tilt = e.beta! * Math.PI / 180;
            const canvasAngle = -this.tilt;
            this.canvas.style.transform =`translate(-50%,-50%) rotate(${canvasAngle}rad)`
        })

    }
}