export default class Controls{
    public forward: boolean | number;
    public left: boolean | number;
    public right: boolean | number;
    public reverse:boolean | number;
    constructor(public type:string) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        //?? make traffic cars moving by themselves 
        switch (type) {
            case "KEYS":
                this.addKeyboardListener();
                break;
            case "DUMMY":
                this.forward = true;
                break;
            default:
                break;
        }
    }

    //keyboard controls
    //when keys r pressed ...
    private addKeyboardListener() {
        document.onkeydown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break
                case "ArrowUp":
                    this.forward = true;
                    break
                case "ArrowDown":
                    this.reverse = true;
                    break
            }
            //console.table(this);
        }

        //when keys realeased ...
        document.onkeyup = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break
                case "ArrowUp":
                    this.forward = false;
                    break
                case "ArrowDown":
                    this.reverse = false;
                    break
            }
            //console.table(this);
        }

    }

 }