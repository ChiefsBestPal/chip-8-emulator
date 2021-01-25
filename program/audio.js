class Speaker {
	constructor() {
		const AudioContext = window.AudioContext || window.webkitAudioContext;

		this.audioCtx = new AudioContext();

        // Create a gain, which will allow us to control the volume
		this.gain = this.audioCtx.createGain();
		this.finish = this.audioCtx.destination;

        // Connect the gain to the audio context
		this.gain.connect(this.finish);
    }
    
    play(frequency) {
        if (this.audioCtx && !this.oscillator) {
            this.oscillator = this.audioCtx.createOscillator();
    
            // Set the frequency
            this.oscillator.frequency.setValueAtTime(frequency || 440, this.audioCtx.currentTime);
    
            // Square wave
            this.oscillator.type = 'square';
    
            // Connect the gain and start the sound
            this.oscillator.connect(this.gain);
            this.oscillator.start();
        }
    }

    stop() {
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator.disconnect();
            this.oscillator = null;
        }
    }
}

export default Speaker;



class audio{
    constructor(){

    }
    run(){
        let ctxAudio = new AudioContext();
        const sampleRate = 44100;
        const lin_frequency = 440; //f
        const ang_frequency = 2 * Math.PI * lin_frequency; //omega
        let testTime = 2;
        let channels = 1;
        let testBuffer = ctxAudio.createBuffer(
          channels,
          testTime * sampleRate,
          sampleRate / 2
        );
        let monoArray = testBuffer.getChannelData(0); //float32 Typed array
        function computeSamples(sampleIx, defWaveAmplitude = Math.abs(4)) {
          let time = sampleIx / sampleRate;
          let angle = parseFloat(0) - time * ang_frequency + 0.0;
          return defWaveAmplitude * Math.sin(angle);
        }
        console.log("DEBUG: ADD GAIN\t");
        for (let sampleNumber = 0; sampleNumber < 88200; sampleNumber++) {
          monoArray[sampleNumber] = computeSamples(sampleNumber);
        }
        //var o = context.createOscillator() //!normal mode ?
        //var  g = context.createGain()
      
        let src_node = ctxAudio.createBufferSource();
        src_node.buffer = testBuffer;
        src_node.connect(ctxAudio.destination);
        src_node.start();

    }
}
