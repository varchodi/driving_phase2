export default class Engine {
    constructor(public analyzer: AnalyserNode) {
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

        this.analyzer = audioContext.createAnalyser();
        this.analyzer.fftSize = 2 ** 15
        masterGain.connect(analyzer);
    }
}