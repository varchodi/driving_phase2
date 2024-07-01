// let myVideo = document.getElementById("myVideo") as HTMLVideoElement;
const myCanvas = document.getElementById("myCanvas") as HTMLCanvasElement;

const myVideo = document.createElement('video')!;
const ctx = myCanvas.getContext('2d')!;

const loop = () => {
    
    //draw video on canvas
    ctx.drawImage(myVideo, 0, 0, myCanvas.width, myCanvas.height);
    requestAnimationFrame(loop);
    
}

// get camera access
navigator.mediaDevices.getUserMedia({
    video:true
}).then((rawData:MediaStream) => {
    myVideo.srcObject = rawData; // display camera data  
    myVideo.play() //play video

    myVideo.onloadeddata = () => {
        myCanvas.width = myVideo.videoWidth // set to same width ass video stream
        myCanvas.height = myVideo.videoHeight
        
        //draw video on canvas
        // ctx.drawImage(myVideo,0,0,myCanvas.width,myCanvas.height) // draw only one frame ( 1rst)
        loop() //draw video on canvas
    }
}).catch((error) => {
    alert(error)
})