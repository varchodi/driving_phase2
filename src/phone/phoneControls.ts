export class PhoneControls{
    public tilt: number;
    constructor() {
        this.tilt = 0;
        this.addAdventListeners();
    }

    private addAdventListeners() {
        window.addEventListener('deviceorientation', (e: DeviceOrientationEvent) => {
            console.log(e)
        })
    }
}