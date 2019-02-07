#!/usr/bin/env node

const fs = require("fs");
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const e = "\u001b[";
const reset = e + "0m";
const red = e + "31m";
const blue = e + "34m"
function exit(int) {
  console.error(reset);
  rl.close();
  process.exit(int);
}
function error(message, code) {
  rl.write(red + message + "\n");
  exit(code);
}
const fileName = process.argv[2];
if (fileName === undefined) {
  error("lnedit: missing file/symlink operand", 1);
}
try {
  var stats = fs.lstatSync(fileName);
} catch (e) {
  error(`ENOENT: "${fileName}" does not exist!`, 34);
}
if (!stats.isSymbolicLink()) {
  error(`"${blue}${fileName}${red}" is not a symlink!`, 1);
}
let path = fs.readlinkSync(fileName);
try {
  const realPath = fs.realpathSync(path);
  path = realPath;
} catch (e) { }
rl.question(blue, newPath => {
  fs.unlinkSync(fileName);
  fs.symlinkSync(newPath, fileName);
  exit();
});
rl.write(path);
rl.once("SIGINT", exit);
