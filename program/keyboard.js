//const keys = require('./keyboadKeys.json') //KEYCODE
//USE THIS KEY LAYOUT INSTEAD
// var KEYMAP = {
//     49: 0x1, // 1
//     50: 0x2, // 2
//     51: 0x3, // 3
//     52: 0xc, // 4
//     81: 0x4, // Q
//     87: 0x5, // W
//     69: 0x6, // E
//     82: 0xD, // R
//     65: 0x7, // A
//     83: 0x8, // S
//     68: 0x9, // D
//     70: 0xE, // F
//     90: 0xA, // Z
//     88: 0x0, // X
//     67: 0xB, // C
//     86: 0xF  // V
// }
var KEYMAP = {
    1: 0x1, // 1
    2: 0x2, // 2
    3: 0x3, // 3
    4: 0xC, // 4
    q: 0x4, // Q
    w: 0x5, // W
    e: 0x6, // E
    r: 0xD, // R
    a: 0x7, // A
    s: 0x8, // S
    d: 0x9, // D
    f: 0xE, // F
    z: 0xA, // Z
    x: 0x0, // X
    c: 0xB, // C
    v: 0xF, // V
  };

class Keyboard { //make circuit for this !
    constructor() {
        this.KEYMAP = KEYMAP

        this.await = false
        this.SetKeyPress = null //function (key) {void key}

        this.pressedKeys = new Array();


        window.addEventListener('keydown', this.KeyDown.bind(this), false);
        window.addEventListener('keyup', this.KeyUp.bind(this), false);
        //!window.addEventListener('keypress',this.awaitKeyPress.bind(this));
    }
    
    isKeyPressed(keyCode) {
        return !!this.pressedKeys[keyCode];
    }

    KeyDown(event) {
        // if (event.defaultPrevented) {
        //     return; // Do nothing if the event was already processed
        //   }
        let key = this.KEYMAP[event.key];
        this.pressedKeys[key] = true;
        if(this.await && this.KEYMAP.hasOwnProperty(toString(event.key).toLowerCase()) && this.SetKeyPress !== null){ //!await may cause errors
            console.log('test')
            this.SetKeyPress(key);
            this.SetKeyPress = null
            //await = false
        }
        
        }//strict mode?

    

    KeyUp(event) {
        let key = this.KEYMAP[event.key];
        this.pressedKeys[key] = false;
        
    }
}

export default Keyboard;