// TypeScript Version
import * as fs from "fs";
import * as uuid from "uuid";

interface Data {
  name: string,
  count: number
}

function total(data: Data[]): number {
  let t = 0;
  data.forEach(item => {
    t += item.count;
  });
  return t;
}

const content = fs.readFileSync('data.json');
const data: Data[] = JSON.parse(content.toString());
console.log(total(data));


// Vanilla JavaScript Version

// const fs = require('fs');

// function total(data) {
//   let t = 0;
//   data.forEach(item => {
//     t += item.count;
//   });
//   return t;
// }

// const data = JSON.parse(fs.readFileSync('data.json'));
// console.log(total(data));
