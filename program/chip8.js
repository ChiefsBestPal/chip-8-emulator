import visualsrender from './visualsrender.js'
import CPU from './CPU.js'
import Keyboard from './keyboard.js';
import Speaker from './audio.js';

const renderer = new visualsrender(10);
const keyboard = new Keyboard();
const speaker = new Speaker();

const cpu = new CPU(renderer,keyboard,speaker); 

//*https://github.com/loociano/ESboy/blob/master/src/renderer.js

var CLOCK_SPEED = 10;

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
        speaker.play(440);
    } 
    else {
        speaker.stop();
    }

    cpu.visuals.render();
    
};


let loop;

let fps = 60, fpsInterval, startTime, now, then, elapsed;

function init() {
	fpsInterval = 1000 / fps;
	then = Date.now();
	startTime = then;

	cpu.loadSprites();
	cpu.loadROM('BLINKY');
	loop = window.requestAnimationFrame(step);
}

function step() {
	now = Date.now();
	elapsed = now - then;

	if (elapsed > fpsInterval) {
		cycle();
	}

	loop = window.requestAnimationFrame(step);
}

init();



