//* import visualsrender from './visualsrender.js'
import CPU from './CPU.js'
//* import Keyboard from './keyboard.js';
//* import Speaker from './audio.js';

//* const visuals = new visualsrender(10);
//* const keyboard = new Keyboard();
//* const audio = new Speaker();

const cpu = new CPU(); 

var CLOCK_SPEED = 16;
function loadROM(programName){
        
    // @param {array Buffer} ROM is read
    
    //program read are typed as ArrayBuffer//! USE FILE READER***************************************************************************
    const request = new XMLHttpRequest;
    // request.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //       callback.call(this, this.response);
    //     }
    //   };
    //console.log(this.RAM)
    console.log(cpu.RAM)
    request.onload = function() {
        console.log(cpu.RAM)
        if (request.response){

            cancelAnimationFrame(loop);//! Maybe err
            cpu.loadSprites();      //!Maybe err
            let program = new Uint8Array(request.response)
        
            for (let pos = 0; pos < program.length; pos++){ //starts at ix 512 (bit)
                cpu.RAM[0x200 + pos] = program[pos]
            }
            loop = requestAnimationFrame(tick)//! maybe err
        }
    }
    const url = "./ROMS/programs/"
    request.open('GET',url + programName);//removed GET args[0]//3rdparam: true
    request.responseType = 'arraybuffer'

    request.send();

}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function fetch (memory) {//fetch next instruction at tick
    return memory[cpu.PC] << 8 | memory[cpu.PC + 1];
};

function cycle() {
    for (let i = 0; i < CLOCK_SPEED; i++) {
        if (!cpu.keyboard.await) {
            let opcode = fetch(cpu.RAM)
            cpu.PC += 2
            cpu.executeFromInstructionSet(opcode);
        }
    }

    if (!cpu.keyboard.await) {
        cpu.refreshTimers();
    }

    if (cpu.soundTimer > 0) {
        // ? This will play the audio at each cycle
        // which means it will make a chaotic sound
        // unless your sound generator only generates sound
        // for 1/60 s
        cpu.audio.play(440);
    } 
    else {
        cpu.audio.stop();
    }

    cpu.visuals.render();
    
};


let loop;

let fps = 60, fpsInterval, startTime, now, then, delta;

function init() {
	fpsInterval = 1000 / fps;
	then = Date.now(); //setInterval
	startTime = then;

    cpu.loadSprites();
	loadROM('IBM Logo.ch8');
	loop = requestAnimationFrame(tick);
}

function tick() {
	now = Date.now();
	delta = now - then; //!DEBUG!!!!!!!!!!!!!

	if (delta > fpsInterval) {
		cycle();
	}

    loop = requestAnimationFrame(tick);
}

// init();

const init2 = () => {
    cpu.loadSprites();
	loadROM('IBM Logo.ch8');
    setInterval(cycle, 1000/60);
};

init2();

console.log('sdad')