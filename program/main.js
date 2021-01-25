// const main = () => {
//   let canvas = document.querySelector("canvas"); //create accessors with lang
//   let ctx = canvas.getContext("2d");
//   ctx.fillStyle = "#000000";
//   ctx.fillRect(0, 0, 64, 32);
// };
//!Web workers API: epic background thread
function draw() {
  var ctx = document.getElementById("canvas").getContext("2d"); //innerHTML print
  ctx.font = "48px serif";
  ctx.strokeText("Hello world", 10, 50);
}
import Keyboard from "./keyboard.js";
import audio from "./audio.js";
let KEYMAP = {
  1: 0x1, // 1
  2: 0x2, // 2
  3: 0x3, // 3
  4: 0xc, // 4
  q: 0x4, // Q
  w: 0x5, // W
  e: 0x6, // E
  r: 0xd, // R
  a: 0x7, // A
  s: 0x8, // S
  d: 0x9, // D
  f: 0xe, // F
  z: 0xa, // Z
  x: 0x0, // X
  c: 0xb, // C
  v: 0xf, // V
};
const main = () => {
  // let speaker = new audio();
  // speaker.run()
  let clavier = new Keyboard();
  clavier.await = true;
  // let arr2 = []
  // clavier.SetKeyPress = function(key) { //dont use arrow func with bind and this obj
  //   arr2 = [key]
  //   clavier.await = false
  // }.bind(this).call(this)





  let arr = [...Array(32).fill(0)].map((e) =>
    new Array(64).fill(0).map((e) => (Math.random() >= 0.3 ? 0 : 1))
  );
  console.table(arr);

  const canvas = document.querySelector("canvas");
  const cellSide = 50;
  canvas.width = 64 * cellSide;
  canvas.height = 32 * cellSide;

  arr[15][31] = 2;
  arr[15][32] = 2;
  arr[16][31] = 2;
  arr[16][32] = 2;
  var ctx = canvas.getContext("2d");
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      let x = j * cellSide;
      let y = i * cellSide;

      var cellColor = "#000000";
      if (arr[i][j] === 1) {
        cellColor = "#107D1C";
      }
      if (arr[i][j] == 2) {
        cellColor = "#FF0000";
      }

      ctx.beginPath();
      ctx.fillStyle = cellColor;
      ctx.fillRect(x, y, cellSide, cellSide);
    }
  }
  console.log("MAIN")

  //let reader = new FileReader(); //!make dropzone to load programs on website!
};


async function testing(hashMap) {
  let res = undefined;
  console.log("waiting keypress..");
  await new Promise((resolve) => {
    const handler = (event) => {
      if (hashMap.hasOwnProperty(event.key)) {
        res = event.key;
        document.removeEventListener("keydown", handler);
        resolve();
      }
    };
    document.addEventListener("keydown", handler);
  });
  
    console.log("Over !!!!!!!!");
  
}
let pause = true
const waitValidKeyPress = async () => {
  await testing(KEYMAP);
  main();
  console.log("After main");
}
//main()
//waitValidKeyPress();




