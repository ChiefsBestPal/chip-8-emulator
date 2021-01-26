//(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

        function gcd (a, b) {
    return (b === 0) ? a : this.gcd(b, a%b);
}
void function ratioPrint(w,h) {
    let ratio = gcd(defaultWidth,defaultHeight)
    console.log('AspectRatio check (no null values); '+ w/ratio +
        ' : ' + h/ratio)
}
const defaultWidth = 64; //cols
const defaultHeight = 32; //rows

class visualsrender {


    constructor(scale) {


        this.scale = scale;

        this.canvas = document.querySelector('canvas'); //create accessors with lang
        this.ctx = this.canvas.getContext('2d');


        this.canvas.width = defaultWidth * this.scale;
        this.canvas.height = defaultHeight * this.scale;

        //ratioPrint(this.canvas.width,this.canvas.height);

        this.displayPixels = new Array(2048); //64x32 default number of pixels


    }
    resetCanvas(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
    }
    clearDisplay() {
        this.displayPixels = new Array(64 * 32);
    }

    drawPixel(x, y) {
        console.log("drawPixel", x, y);
        if (x > defaultWidth) {
            x -= defaultWidth;
        } else if (x < 0) {
            x += defaultWidth;
        }

        if (y > defaultHeight) {
            y -= defaultHeight;
        } else if (y < 0) {
            y += defaultHeight;
        }
        let pixelLoc = x + y*defaultWidth//1D array
        this.displayPixels[pixelLoc] ^= 1; //switch on and off

        return !!this.displayPixels[pixelLoc] //return True if pixel there, False if not
    }

    render(){
        // let bool = (el) => el === 1 || el === true;
        // console.log(this.displayPixels.some(bool))
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        for(let i = 0; i < 2048; i++){
            let cellColor = "#000000"
            let coords = [i % defaultWidth,Math.floor(i / defaultWidth)]
            coords = coords.map(el => el * this.scale)
            let X = coords[0],Y=coords[1]
            if(this.displayPixels[i] === 1){
                cellColor = "#107D1C"
            }
            //!this.ctx.beginPath();
            this.ctx.fillStyle = cellColor;
            this.ctx.fillRect(X,Y,this.scale,this.scale) //default is min 1
            
        }
    }

}

export default visualsrender;
//module.exports =  {visualsrender}
    //},{}]},{},[1]);