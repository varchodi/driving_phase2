const myCanvas = document.getElementById("soundVis") as HTMLCanvasElement;
const ctx = myCanvas.getContext('2d') as CanvasRenderingContext2D;

let analyzer:AnalyserNode = null!;

window.addEventListener("click", beep);
animate();

function animate() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

    if (analyzer) {
        //!create an empy array of 8 bits cars x size (2048 ??)
        const data = new Uint8Array(analyzer.fftSize);
        analyzer.getByteTimeDomainData(data); //?? put sound wave datas in the array(data)

        ctx.beginPath();
        for (let i = 0; i < data.length; i++){
            const x = myCanvas.width * i / data.length; 
            const y = data[i];

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
    requestAnimationFrame(animate);
}

function beep() {
    const audioContext = new window.AudioContext();
    const osc = audioContext.createOscillator();
    //??other nodes 
    const envellope = audioContext.createGain();

    osc.frequency.setValueAtTime(400, 0);
    //?? connect to enveloppe
    osc.connect(envellope);
    osc.start();
    osc.stop(4);
    //?? setup env gain 
    envellope.gain.value = 0;
    envellope.gain.linearRampToValueAtTime(1, .1);
    envellope.gain.linearRampToValueAtTime(0, 0.4);
    //conect grain to ctx (speakers)
    envellope.connect(audioContext.destination)

    analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 2 ** 13
    envellope.connect(analyzer);
}