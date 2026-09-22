const fs = require("fs");
const path = require("path");
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes("node_modules") && !file.includes(".git")) {
        results = results.concat(walk(file));
      }
    } else {
      results.push(file);
    }
  });
  return results;
}
console.log(walk(".").filter(f => f.includes("02") || f.includes("05") || f.includes(".mp3") || f.includes(".ogg") || f.includes(".wav")));
