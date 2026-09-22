import fs from 'fs';
import path from 'path';

function walk(dir: string): string[] {
  let results: string[] = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('dist')) {
          results = results.concat(walk(fullPath));
        }
      } else {
        results.push(fullPath);
      }
    });
  } catch (e) {}
  return results;
}

const allFiles = walk('.');
const mediaFiles = allFiles.filter(f => {
  const ext = path.extname(f).toLowerCase();
  return ext === '.mp4' || ext === '.webm' || ext === '.mov' || ext === '.avi' || ext === '.mkv';
});

console.log('=== MEDIA FILES LOCATED ===');
console.log(mediaFiles);
console.log('=== ALL FILES LOCATED ===');
console.log(allFiles.filter(f => !f.includes('node_modules')));



