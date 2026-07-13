/**
 * Clamp Utility
 * node starter/index.js < starter/sample.input
 */

const readline = require("node:readline");


function clamp(value,min,max){


const comparedValue = Number(value);
const minThreshold = Number(min);
const maxThreshold = Number (max);


// clamp lower boundary
if (comparedValue < minThreshold){
    return(minThreshold);
}        

// clamp higher boundary
else if (comparedValue > maxThreshold){
   return(maxThreshold);
}        
else {

    return(comparedValue);
}

}


function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    lines.push(line);
    if (lines.length < 3) return;


  // validate numbers    
   if ( !Number.isFinite(Number(lines[0])) || !Number.isFinite(Number(lines[1])) || !Number.isFinite(Number(lines[2])) ) {

    process.stdout.write("ERROR: invalid number\n");
    rl.close();
    return;
    }
    
    // validate min<max

    else if (Number(lines[1])>=Number(lines[2])){

    process.stdout.write("ERROR: invalid range\n");
    rl.close();
    return;
}

  process.stdout.write(`Result: ${clamp (lines[0],lines[1],lines[2])}\n`);
  rl.close();

  });
}

main();