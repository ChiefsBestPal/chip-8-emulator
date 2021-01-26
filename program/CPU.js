//  4kb of RAM, the first 512Kb, 16 8bits registers, 1 16bits register I to store memory addresses, 2 8bits special registers (TIMERS for delay and sound),PC, a stack 16 16bits values
const Uint16 = (n=0x0) => {return n & 0xFFF}
const Uint8 = (n=0x0) => {return n & 0xFF}
import visualsrender from './visualsrender.js'
import Keyboard from './keyboard.js';
import Speaker from './audio.js';

const visuals = new visualsrender(10);
const keyboard = new Keyboard();
const audio = new Speaker();
class CPU {
    constructor(){
        
        this.visuals = visuals;
        this.keyboard = keyboard;
        this.audio = audio;

        this.keyboard.await = true;

        //! allocated memory
        this.RAM = new Uint8Array(4096); //0x000:0 -> 0xFFF:4095 Buffer properties and index limit at 0 and 255
                                   //*make it clamped for index restriction
        //! Registers
        this.V = new Uint8Array(16); //from V0 to VF, VF is used as flag for instructions
        this.I = Uint16(); //? rightmost 12 bits used to store memory addresses
        
        this.delayTimer =  Uint8();
        this.soundTimer = Uint8();

        //! Store address
        this.stack = new Uint16Array(16); //store addresses that intepreter should return once finished with a subroutine(function+-)
        //16 levels of nested subroutines //?Watch out for undefined result!

        //!Not accessable by programs: pseudo-registers
        this.PC = 0x200; //? Program counter, for storing current executing address 
        //-> PE = PC + rom programs    -> PE + control unit with clock at exec = +-CPU 
        this.SP = Uint8() //? Stack pointer , point to top of stack

    }
    //Chip-8 draws graphics on screen through the use of sprites.
    // A sprite is a group of bytes which are a binary representation of the desired picture. Chip-8 sprites may be up to 15 bytes, for a possible sprite size of 8x15.
    loadSprites(){ //loaded at intepreter section (the 512 bytes 0x000 to 0x1FF section)
        const hexSprites = [ //row = sprite = 5 bytes (0x**)
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80  // F
        ];
        for(let ix = 0; ix < hexSprites.length; ix++){ // Math.floor(ix/5) = key_row
            this.RAM[ix] = hexSprites[ix]
        }
    }



    refreshTimers() {
        if (this.delayTimer > 0){
            
            this.delayTimer--;
        }
        if (this.soundTimer > 0){

            this.soundTimer--
        }
    }

    //*tick(){}
//  All instructions are 2 bytes long and are stored most-significant-byte first. In memory, the first byte of each instruction should be located at an even addresses. 
// If a program includes sprite data, it should be padded so any instructions following it will be properly situated in RAM.

//?0x7231   Lbyte instr= 31    Hbyte instr= 72     x-> 2    y-> 3    so 2nd and 3rd of hex 

// In these listings, the following variables are used:

// nnn or addr - A 12-bit value, the lowest 12 bits of the instruction
// n or nibble - A 4-bit value, the lowest 4 bits of the instruction
// x - A 4-bit value, the lower 4 bits of the high byte of the instruction    byte with bit15 = high
// y - A 4-bit value, the upper 4 bits of the low byte of the instruction     byte with bit0 = low
// kk or byte - An 8-bit value, the lowest 8 bits of the instruction
//JS uses 32 bits signed integers for bitwise by default... leftmost bit is sign bit (MSB)
    executeFromInstructionSet(opcode){
        var x = (0x0F00 & opcode) >> 8 //2nd nibble; shift 2nd group of 4 bits (binary)
        var y = (0x00F0 & opcode) >> 4 //3rd nibble; shift 3rd group of 4 bits(binary)
        switch (0xF000 & opcode) {
            case 0x0000: //0nnn - SYS addr
            // Jump to a machine code routine at nnn.

                switch (opcode) {
                    case 0x00E0: //00E0 - CLS
                        // Clear the display
                        console.log(this.visuals)
                        this.visuals.clearDisplay() //[...Array(32)].map(e=> new Array(64))
                        break;
                    case 0x00EE:// 00EE - RET
                        // Return from a subroutine.
                        this.PC = this.stack[this.SP]
                        this.SP--
                        break;
                }
        
                break;
            case 0x1000://1nnn - JP addr
                //Jump to location nnn.
                this.PC = 0x0FFF & opcode;
                this.PC -= 2;
                break;
            case 0x2000://2nnn - CALL addr
                //Call subroutine at nnn.
                this.stack[this.SP++] = this.PC
                this.PC = 0x0FFF & opcode
                this.PC -= 2; //!HERE
                break;
            case 0x3000://3xkk - SE Vx, byte
                //Skip next instruction if Vx = kk.
                if (this.V[x] === (0x00FF&opcode)){
                    this.PC += 2;
                }
                break;
            case 0x4000://4xkk - SNE Vx, byte
                //Skip next instruction if Vx != kk.
                if(this.V[x] != (0x00FF&opcode)){
                    this.PC += 2;
                }

                break;
            case 0x5000: //5xy0 - SE Vx, Vy
                //Skip next instruction if Vx = Vy.
                if (this.V[x] === this.V[y]){
                    this.PC += 2;
                }
                break;
            case 0x6000: //6xkk - LD Vx, byte
                //Set Vx = kk.
                this.V[x] = 0x00FF&opcode
                break;
            case 0x7000: //7xkk - ADD Vx, byte
                //Set Vx = Vx + kk.
                this.V[x] += 0x00FF&opcode
                break;
            case 0x8000:
                switch (0x000F & opcode) { 
                    case 0x0000: //8xy0 - LD Vx, Vy
                        //Set Vx = Vy.
                        this.V[x] = this.V[y]
                        break;
                    case 0x0001: //8xy1 - OR Vx, Vy
                        //Set Vx = Vx OR Vy.
                        this.V[x] |= this.V[y]
                        break;
                    case 0x0002: //8xy2 - AND Vx, Vy
                        //Set Vx = Vx AND Vy.
                        this.V[x] &= this.V[y]
                        break;
                    case 0x0003: //8xy3 - XOR Vx, Vy
                        //Set Vx = Vx XOR Vy.
                        this.V[x] ^= this.V[y]
                        break;
                    case 0x0004://8xy4 - ADD Vx, Vy
                        //Set Vx = Vx + Vy, set VF = carry.
                        let carryCond = this.V[x] + this.V[y];
                        this.V[0xF] = (carryCond >= 2**8) ? 1 : 0;
                        this.V[x] = 0x00FF & carryCond
                        break;
                    case 0x0005://8xy5 - SUB Vx, Vy
                        //Set Vx = Vx - Vy, set VF = NOT borrow.
                        let borrowCond5 = this.V[x] <= this.V[y];
                        this.V[0xF] = (!borrowCond5) ? 1 : 0;
                        this.V[x] -= this.V[y];
                        break;
                    case 0x0006: //8xy6 - SHR Vx {, Vy}
                        //Set Vx = Vx SHR 1.
                    //use bitshift instead of mult/div by  2, less latency
                        let LSB = this.V[x] & 0b1;
                        this.V[0xF] = LSB;
                        this.V[x] >>= 1;
                        break;
                    case 0x0007://8xy7 - SUBN Vx, Vy
                        //Set Vx = Vy - Vx, set VF = NOT borrow.
                        let borrowCond7 = this.V[x] >= this.V[y];
                        this.V[0xF] = (!borrowCond7) ? 1 : 0;
                        this.V[x] = this.V[y] - this.V[x];
                        break;
                    case 0x000E: //8xyE - SHL Vx {, Vy}
                        //Set Vx = Vx SHL 1.
                    //Additions could work, Fulladders can make it in 1 clock cycle
                        let MSB = this.V[x] >> 7;
                        this.V[0xF] = MSB;
                        this.V[x] <<= 1;
                        break;
                }
        
                break;
            case 0x9000: //9xy0 - SNE Vx, Vy
                //Skip next instruction if Vx != Vy.
                if (this.V[x] != this.V[y]){
                    this.PC += 2;
                }
                break;
            case 0xA000://Annn - LD I, addr
                //Set I = nnn.
                this.I = 0x0FFF & opcode
                break;
            case 0xB000://Bnnn - JP V0, addr
                //Jump to location nnn + V0.
                this.PC = (0x0FFF & opcode) +  Uint16(this.V[0])
                break;
            case 0xC000://Cxkk - RND Vx, byte
                //Set Vx = random byte AND kk.
                this.V[x] = Math.random() * 256 | 0 & Uint8(0x00FF & opcode)
                break;
            case 0xD000://Dxyn - DRW Vx, Vy, nibble
                //Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision.
                this.V[0xF] = 0;
                const location = this.I;
                //sprite: 8xn
                const sprite_width =  parseInt(0xFF,10).toString(2).length // 8
                const sprite_layers = 0x000F & opcode // n

                for(let row = 0; row < sprite_layers; ++row){
                    let sprite = this.RAM[location + row]; // loc++ 
                    for(let col = 0;col < sprite_width;++col){
                        //!const bleftmost = sprite & (0x0080 >> row);
                        if ((sprite & 0x0080) != 0){
                            if(this.visuals.drawPixel(this.V[x] + col,this.V[y] + row) === 1){
                                this.V[0xF] = 1; // XORed pixel = erased
                            }
                        }
                        sprite = sprite << 1 // pad / last should be 0000 0000
                    }
                }
                break;
            case 0xE000:
                switch (opcode & 0x00FF) {
                    case 0x009E: //Ex9E - SKP Vx
                        //Skip next instruction if key with the value of Vx is pressed.
                        if (this.keyboard.isKeyPressed(this.V[x])){
                            this.PC += 2;
                        }
                        break;
                    case 0x00A1://ExA1 - SKNP Vx
                        //Skip next instruction if key with the value of Vx is not pressed.
                        if (!this.keyboard.isKeyPressed(this.V[x])){
                            this.PC += 2;
                        }
                        break;
                }
                //default:
                    //throw new Error("Unkown opcode (keyboard)")
        
                break;
            case 0xF000:
                switch (opcode & 0x00FF) {
                    case 0x0007://Fx07 - LD Vx, DT
                        //Set Vx = delay timer value.
                        this.V[x] = this.delayTimer
                        break;
                    case 0x000A://Fx0A - LD Vx, K
                        //Wait for a key press, store the value of the key in Vx.//!ADD !AWAIT in cycles
                        console.log('Hate this instruction')
                        this.keyboard.await = true;
                        this.keyboard.SetKeyPress = function(key) { //dont use arrow func with bind and this obj
                          this.V[x] = key
                          this.keyboard.await = false
                        }.bind(this)//?.call(this)

                        break;
                    case 0x0015://Fx15 - LD DT, Vx
                        //Set delay timer = Vx.
                        this.delayTimer = this.V[x]
                        break;
                    case 0x0018://Fx18 - LD ST, Vx
                        //Set sound timer = Vx.
                        this.soundTimer = this.V[x]
                        break;
                    case 0x001E://Fx1E - ADD I, Vx
                        //Set I = I + Vx.
                        this.I += Uint16(this.V[x])
                        break;
                    case 0x0029://Fx29 - LD F, Vx
                        //Set I = location of sprite for digit Vx.
                        this.I = Uint16(0x0000 + this.V[x] * 0o5)
                        break;
                    case 0x0033:// Fx33 - LD B, Vx
                        // Store BCD representation of Vx in memory locations I, I+1, and I+2.
                        let BCD = parseInt(this.V[x] / 10)
                        this.RAM[this.I] = BCD / 10 | 0
                        this.RAM[this.I + 1] = BCD % 10 | 0
                        this.RAM[this.I + 2] = BCD * 10 & 0b1
                        break;
                    case 0x0055:// Fx55 - LD [I], Vx
                        // Store registers V0 through Vx in memory starting at location I.
                        //from starting location == I, WRITE to ram[location] all values of registers from v0 to vx ram = v
                        let mem_location = this.I;
                        for(let register_num = 0; register_num <= x; register_num++ ){
                            this.RAM[mem_location++] = this.V[register_num]
                        } 

                        break;
                    case 0x0065:// Fx65 - LD Vx, [I]
                        // Read registers V0 through Vx from memory starting at location I.
                        //from starting location == I, READ v[registers] for all locations from memory , registers from v0 to vx v = ram
                        let _mem_location = this.I;
                        for(let register_num = 0; register_num <= x; register_num++ ){
                            this.V[register_num] = this.RAM[_mem_location++]
                        } 
                        break;
                }
        
                break;
        
            default:
                throw new Error('Unknown opcode ' + opcode);
        }
        //*PC+= 2
    }
}
export default CPU;



