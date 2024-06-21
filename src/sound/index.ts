const audioContext = new window.AudioContext();
const osc = audioContext.createOscillator();
osc.connect(audioContext.destination);
 osc.start();