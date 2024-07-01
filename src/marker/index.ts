const myVideo = document.getElementById("myVideo") as HTMLVideoElement;

// get camera access
navigator.mediaDevices.getUserMedia({
    video:true
}).then((rawData:MediaStream) => {
    myVideo.srcObject = rawData; // display camera data  
    myVideo.play() //play video
}).catch((error) => {
    alert(error)
})