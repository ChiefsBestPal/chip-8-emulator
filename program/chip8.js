//* import visualsrender from './visualsrender.js'
import CPU from './CPU.js'
//* import Keyboard from './keyboard.js';
//* import Speaker from './audio.js';

//* const visuals = new visualsrender(10);
//* const keyboard = new Keyboard();
//* const audio = new Speaker();

const cpu = new CPU(); 

var CLOCK_SPEED = 10;
function loadROM(programName){
        
    // @param {array Buffer} ROM is read
    
    //program read are typed as ArrayBuffer//! USE FILE READER***************************************************************************
    const request = new XMLHttpRequest();
    request.onload = function() {
        if (request.response){
            let program = new Uint8Array(request.response) 
            
            for (let pos = 0; pos < program.length; pos++){ //starts at ix 512 (bit) --> //? Load Program onto memory
                cpu.RAM[0x200 + pos] = program[pos]
            }
            // console.log("request onload", Array.from(cpu.RAM.slice(0x200, 0x284)).map(e => e.toString(16)).join(" "));
            cpu.keyboard.await = false;
        }
    }
    //const url = "./ROMS/"
    const url = "./"
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

const hex = (n) => n.toString(16).padStart(4, "0");

function cycle() {
    // console.log("cycle");
    if (cpu.PC > 4096) {
        console.error("PC is out of range");
        clearInterval(interval)
    };
    for (let i = 0; i < CLOCK_SPEED; i++) {
        if (!cpu.keyboard.await) {
            let opcode = fetch(cpu.RAM)

            if ((opcode & 0xF000) == 0x1000 && cpu.PC == (opcode & 0x0FFF)) {
                console.log("Infinite loop, clearing interval...");
                clearInterval(interval);
            };

            // if (cpu.PC < 580)
            console.log("fetching next instruction", "PC:", hex(cpu.PC), "opcode:", hex(opcode));
            cpu.executeFromInstructionSet(opcode);
            cpu.PC += 2
        }
    }

    if (!cpu.keyboard.await) {
        cpu.refreshTimers();
    }
    
    if (cpu.soundTimer > 0) {
        cpu.audio.play(440);
    } 
    else {
        cpu.audio.stop();
    }

    cpu.visuals.render();
    
};

const fps = 60;

let interval;
const init = () => {
    cpu.loadSprites();
    //loadROM("testProg.ch8")
    loadROM("ROMS/hires/Hires Maze [David Winter, 199x].ch8")
    console.log("cpu ram slice", cpu.RAM.slice(0x200, 0x284));
    interval = setInterval(cycle, 1000/fps);
};

init();

console.log('end of chip8.js');