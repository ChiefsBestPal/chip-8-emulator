//!Web workers API: epic background thread
function draw() {
  var ctx = document.getElementById("canvas").getContext("2d"); //innerHTML print
  ctx.font = "48px serif";
  ctx.strokeText("Hello world", 10, 50);
}


const main = () => {
  // let speaker = new audio();
  // speaker.run()



  let randomBinaryArr = [...Array(32).fill(0)].map((e) =>
    new Array(64).fill(0).map((e) => (Math.random() >= 0.3 ? 0 : 1))
  );

  //console.table(arr);
  //arr = arr.flat();
  //console.table(arr)
  let arr = randomBinaryArr
  const canvas = document.querySelector("canvas");
  const cellSide = 50;
  canvas.width = 64 * cellSide;
  canvas.height = 32 * cellSide;

  var ctx = canvas.getContext("2d");
  for (let i = 0; i < arr.length; i++) {
    let cellColor = "#000000";
    let coords = [i % 64, Math.floor(i / 64)];
    coords = coords.map((el) => el * cellSide);
    let X = coords[0],
      Y = coords[1];

    if (arr[i] === 0) { //no grid background
      //cellColor = "#107D1C";
      ctx.fillStyle = cellColor;
      ctx.fillRect(X, Y, cellSide, cellSide);
    }
    // ctx.fillStyle = cellColor;
    // ctx.fillRect(X, Y, cellSide, cellSide);
  }
  console.log("MAIN");
  
  //!make dropzone to load programs on website!
};
shadingAnim();
main();


async function testingWaitKey(hashMap) {
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
const waitValidKeyPress = async () => {
  await testingWaitKey(KEYMAP);
  main();
  console.log("After main");
};
