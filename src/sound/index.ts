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
    osc.connect(audioContext.destination);
    osc.start();

    analyzer = audioContext.createAnalyser();
    osc.connect(analyzer);
}