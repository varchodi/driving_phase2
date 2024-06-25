// const myCanvas = document.getElementById("soundVis") as HTMLCanvasElement;
// const ctx = myCanvas.getContext('2d') as CanvasRenderingContext2D;

let analyzer: AnalyserNode = null!;
let engine:Engine = null!

// window.addEventListener("click", () => {
    
//     const engine = new Engine();

//     // beep(400);
//     // setTimeout(() => {
//     //     beep(400);

//     //     setTimeout(() => {
//     //         beep(400);
//     //         setTimeout(() => {
//     //             beep(700);
//     //         },1000)
//     //     }, 1000);
//     // }, 1000);
// });

// animate();

// function animate() {
//     ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

//     if (analyzer) {
//         //!create an empy array of 8 bits cars x size (2048 ??)
//         const data = new Uint8Array(analyzer.fftSize);
//         analyzer.getByteTimeDomainData(data); //?? put sound wave datas in the array(data)

//         ctx.beginPath();
//         for (let i = 0; i < data.length; i++){
//             const x = myCanvas.width * i / data.length; 
//             const y = data[i];

//             if (i === 0) {
//                 ctx.moveTo(x, y);
//             } else {
//                 ctx.lineTo(x, y);
//             }
//         }
//         ctx.stroke();
//     }
//     requestAnimationFrame(animate);
// }

export function beep(frequency:number,waveType:OscillatorType = "sine") {
    const audioContext = new 
      (window.AudioContext)();

   const osc = audioContext.createOscillator();
   const envelope = audioContext.createGain();

   osc.frequency.setValueAtTime(frequency, 0);
   osc.type = waveType;
   osc.connect(envelope);
   osc.start();
   osc.stop(0.4);

   envelope.gain.value = 0;
   envelope.gain.linearRampToValueAtTime(1, 0.1);
   envelope.gain.linearRampToValueAtTime(0, 0.4);
   envelope.connect(audioContext.destination);
}


export class Engine {
    public volume: AudioParam;
    public frequency: AudioParam;

    constructor() {
        const audioContext = new window.AudioContext();
        const osc = audioContext.createOscillator();
        //??other nodes 
        const masterGain = audioContext.createGain();

        osc.frequency.setValueAtTime(200, 0);
        //?? connect to enveloppe
        osc.connect(masterGain);
        osc.start();

        //?? setup env gain 
        masterGain.gain.value = 0.2;
        masterGain.connect(audioContext.destination)

        //modulation (control signal using props of other signal)
        const lfo = audioContext.createOscillator();
        lfo.frequency.setValueAtTime(30, 0);
        //special gain
        const mod = audioContext.createGain();
        mod.gain.value = 60;
        lfo.connect(mod);
        mod.connect(osc.frequency);
        lfo.start();

        //control volume
        this.volume = masterGain.gain;
        this.frequency = osc.frequency;

        analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 2 ** 15
        masterGain.connect(analyzer);
    }

    public setVolume(percent: number) {
        this.volume.value = percent;
    }

    public setPitch(percent: number) {
        this.frequency.setValueAtTime(percent * 200 + 100, 0);
    }
}

export function taDaa() {
    beep(400, "sawtooth");
    setTimeout(() => beep(600, "sawtooth"), 200);
 }
 
export  function explode() {
    const audioContext = new 
       (window.AudioContext )();
 
    const numOscillators = 10;
 
    for (let i = 0; i < numOscillators; i++) {
       const osc = audioContext.createOscillator();
       const envelope = audioContext.createGain();
 
       osc.frequency.setValueAtTime(100 + Math.random() * 200, 0);
       osc.connect(envelope);
       osc.start();
       osc.stop(1);
 
       envelope.gain.value = 0;
       envelope.gain.linearRampToValueAtTime(1, 0.1);
       envelope.gain.linearRampToValueAtTime(0, 1);
       envelope.connect(audioContext.destination);
    }
 }
 