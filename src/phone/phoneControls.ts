export class PhoneControls{
    public tilt: number;
    public canvasAngle: number;
    constructor(public canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.tilt = 0;
        this.canvasAngle = 0;
        this.addAdventListeners();
    }

    private addAdventListeners() {
        // ---- Ref - Basic titling -----
        // window.addEventListener('deviceorientation', (e: DeviceOrientationEvent) => {
        //     this.tilt = e.beta! * Math.PI / 180;
        //     const canvasAngle = -this.tilt;
        //     this.canvas.style.transform =`translate(-50%,-50%) rotate(${canvasAngle}rad)`
        // })

        window.addEventListener('devicemotion', (e: DeviceMotionEvent) => {
            this.tilt = Math.atan2(
                e.accelerationIncludingGravity?.y!,
                e.accelerationIncludingGravity?.x!
            )
            const newCanvasAngle = -this.tilt;
            this.canvasAngle = this.canvasAngle * .6  + newCanvasAngle*.4;
            this.canvas.style.transform =`translate(-50%,-50%) rotate(${this.canvasAngle}rad)`
        })

    }
}