const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newGames = `const DEFAULT_GAMES: Game[] = [
  {
    id: 'eaglercraft',
    name: 'Eaglercraft (MC)',
    url: 'https://eaglercraft.q13x.com/',
    image: 'https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#a855f7'
  },
  {
    id: 'retro-bowl',
    name: 'Retro Bowl',
    url: 'https://brunoiscool2.github.io/unblockedgames/play/retrobowl/',
    image: retrobowlImg,
    color: '#4B3621'
  },
  {
    id: 'fnaf-1',
    name: 'FNAF 1',
    url: 'https://brunoiscool2.github.io/unblockedgames/play/fnaf/',
    image: fnaf1Img,
    color: '#8b0000'
  },
  {
    id: 'fnaf-2',
    name: 'FNAF 2',
    url: 'https://brunoiscool2.github.io/unblockedgames/play/fnaf2/',
    image: fnaf2Img,
    color: '#FF8800'
  },
  {
    id: 'slope',
    name: 'Slope',
    url: 'https://brunoiscool2.github.io/unblockedgames/play/slope/',
    image: slopeImg,
    color: '#00FA9A'
  },
  {
    id: 'shell-shockers',
    name: 'Shell Shockers',
    url: 'https://shellshock.io/',
    image: shellshockersImg,
    color: '#facc15'
  },
  {
    id: 'krunker',
    name: 'Krunker.io',
    url: 'https://krunker.io/',
    image: krunkerImg,
    color: '#ff3366'
  },
  {
    id: 'smash-karts',
    name: 'Smash Karts',
    url: 'https://smashkarts.com/',
    image: smashkartsImg,
    color: '#39ff14'
  },
  {
    id: 'hole-io',
    name: 'Hole.io',
    url: 'https://hole-io.com/',
    image: holeioImg,
    color: '#FF00FF'
  },
  {
    id: 'paper-io-2',
    name: 'Paper.io 2',
    url: 'https://paper-io.com/',
    image: paperioImg,
    color: '#FF00FF'
  },
  {
    id: 'geometry-dash',
    name: 'Geometry Dash',
    url: 'https://geometrydash.io/',
    image: 'https://images.unsplash.com/photo-1508933221971-ce453bfbc02a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#00FFFF'
  },
  {
    id: 'subway-surfers',
    name: 'Subway Surfers',
    url: 'https://subwaysurfers.io/',
    image: 'https://images.unsplash.com/photo-1498177688220-337cecc55be3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#facc15',
    defaultPortrait: true
  },
  {
    id: 'fnf',
    name: 'Friday Night Funkin\\'',
    url: 'https://brunoiscool2.github.io/fnf/',
    image: fnfImg,
    color: '#FF1493'
  },
  {
    id: 'drive-mad',
    name: 'Drive Mad',
    url: 'https://brunoiscool2.github.io/games1/drivemad/',
    image: drivemadImg,
    color: '#FF8C00'
  },
  {
    id: 'snake-io',
    name: 'Snake.io',
    url: 'https://brunoiscool2.github.io/games3/snakeio/',
    image: snakeioImg,
    color: '#00FF00'
  },
  {
    id: 'tomb-of-the-mask',
    name: 'Tomb of the Mask',
    url: 'https://beta-brunysixl-v3.onrender.com/games/selfhosted/tombofthemask/index.html',
    image: tombmaskImg,
    color: '#FFD700',
    defaultPortrait: true
  },
  {
    id: '2v2-io',
    name: '2v2.io',
    url: 'https://2v2.io/',
    image: twovtwoImg,
    color: '#ff3366'
  },
  {
    id: 'flappy-bird',
    name: 'Floppy Bird',
    url: 'https://nebezb.com/floppybird/',
    image: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Flappy_Bird_icon.png',
    color: '#ff3366',
    defaultPortrait: true
  },
  {
    id: 'monkey-mart',
    name: 'Monkey Mart',
    url: 'https://monkey-mart.io/',
    image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#8b4513'
  },
  {
    id: 'crossy-road',
    name: 'Crossy Road',
    url: 'https://crossy-road.io/',
    image: 'https://images.unsplash.com/photo-1494809610410-160faaed4de0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#39ff14',
    defaultPortrait: true
  },
  {
    id: 'bitlife',
    name: 'BitLife',
    url: 'https://bitlifefree.io/',
    image: 'https://images.unsplash.com/photo-1555529771-835f59bfc40a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#ff3366',
    defaultPortrait: true
  }
];`;

const startIndex = code.indexOf('const DEFAULT_GAMES: Game[] = [');
const endIndex = code.indexOf('\nexport default function App()');

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + newGames + '\n' + code.substring(endIndex);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Updated DEFAULT_GAMES successfully');
} else {
  console.log('Could not find boundaries');
}
