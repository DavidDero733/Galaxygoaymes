import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, X, Search, Settings, Heart, ChevronLeft, ChevronRight, 
  Smartphone, Monitor, Globe, Wifi, Cpu, Disc, RefreshCw, Volume2, Info, MessageSquare,
  Bell, Users, Calendar, Trophy, Power, VolumeX, Headphones, User, Battery, Sparkles,
  Layers, Play, Palette, Music
} from 'lucide-react';
import { Forum } from './components/Forum';
import { VitaAtmosphere, VitaTheme, CustomWaveSettings } from './components/VitaAtmosphere';
import { PS2Screensaver } from './components/PS2Screensaver';
import { ps2Audio } from './utils/ps2Audio';

// Official PS Vita System Menu Theme (05. PlayStation Store - Main Theme)
const VITA_MUSIC_REMOTE = "https://jetta.vgmtreasurechest.com/soundtracks/ps-vita-system-music/beryrota/05.%20PlayStation%20Store%20-%20Main%20Theme.mp3";
const VITA_MUSIC_LOCAL = "/psvita-theme.mp3";

interface Game {
  id: string;
  name: string;
  url: string;
  image: string;
  color: string;
  defaultPortrait?: boolean;
  description?: string;
  category?: string;
}

const CATEGORIES = ["All", "Favorites", "Action", "Arcade", "Platformer", "Shooter", "Simulation", "Sports", "RPG", "Other"];

const DEFAULT_GAMES: Game[] = [
  {
    id: 'soflo-wheelie-life',
    name: 'sofloWheelieLife',
    url: 'https://scratch.mit.edu/projects/1231016758/embed',
    image: '/soflo-wheelie-life.png',
    color: '#0284c7',
    description: 'Pop high-speed wheelies, pull off crazy stunt combos, switch bikes, and cruise the streets in this fan-favorite motorbike simulator.',
    category: 'Sports'
  },
  {
    id: 'pokemon-silver',
    name: 'Pokémon Silver',
    url: '/pokemon-silver.html',
    image: 'https://images.nintendolife.com/games/gbc/pokemon_silver/cover_large.jpg',
    color: '#C0C0C0',
    description: 'A classic 1999 role-playing game for the Game Boy Color by Game Freak, introducing 100 new Pokémon and the Johto region.',
    category: 'RPG'
  },
  {
    id: 'sonic-robo-blast-2',
    name: 'Sonic Robo Blast 2',
    url: 'https://vinmannie.github.io/srb2web/',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/20/2f/27/202f273f-b11d-52b4-6ab5-a0996bf38b47/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    color: '#1E90FF',
    description: 'A 3D fan-made Sonic the Hedgehog game originally built on a modified Doom engine, featuring fast-paced platforming.',
    category: 'Platformer'
  },
  {
    id: 'sonic-mania',
    name: 'Sonic Mania',
    url: 'https://vinmannie.github.io/SonicManiaWeb/RSDKv5.html',
    image: 'https://steamcdn-a.akamaihd.net/steam/apps/584400/header.jpg',
    color: '#0000FF',
    description: 'A 2017 platform game honoring the original Sega Genesis Sonic games, featuring remixed classic levels and new zones.',
    category: 'Platformer'
  },
  {
    id: 'fnaf-1',
    name: 'FNAF 1',
    url: 'https://fivenightsatfreddysgame.io/play/five-nights-at-freddys/',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/9b/77/03/9b77034f-5ade-ddf5-9c2d-48fd8a546c62/AppIcon-1x_U007epad-0-85-220-0.png/512x512bb.jpg',
    color: '#8b0000',
    description: 'The iconic 2014 indie survival horror classic where you work as a night security guard at Freddy Fazbear\'s Pizza.',
    category: 'Other'
  },
  {
    id: 'fnaf-2',
    name: 'FNAF 2',
    url: 'https://fivenightsatfreddysgame.io/play/five-nights-at-freddys-2/',
    image: 'https://steamcdn-a.akamaihd.net/steam/apps/332800/header.jpg',
    color: '#FF8800',
    description: 'The prequel to the original Five Nights at Freddy\'s, introducing new animatronics and removing the security doors.',
    category: 'Other'
  },
  {
    id: 'eaglercraft',
    name: 'Eaglercraft (MC)',
    url: 'https://eaglercraft.q13x.com/',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/c9/81/16/c981164e-410c-7a07-d76b-3a8e4238793b/AppIcon-0-0-1x_U007emarketing-0-10-0-85-220.png/512x512bb.jpg',
    color: '#a855f7',
    description: 'A fan-made browser-based port of Minecraft version 1.8.8, complete with online multiplayer server support.',
    category: 'Simulation'
  },
  {
    id: 'retro-bowl',
    name: 'Retro Bowl',
    url: '/retrobowl.html',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/ef/a7/1d/efa71d1e-7304-e890-a09c-72edaa3f6580/AppIcon-0-0-1x_U007emarketing-0-8-0-0-85-220.png/512x512bb.jpg',
    color: '#4B3621',
    description: 'A retro-styled American football game inspired by Tecmo Bowl, emphasizing roster management and arcade gameplay.',
    category: 'Sports'
  },
  {
    id: 'slope',
    name: 'Slope',
    url: 'https://brunoiscool2.github.io/unblockedgames/play/slope/',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/1a/bd/65/1abd65ad-c663-0b81-daa0-ed8d5d9ce3cb/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
    color: '#00FA9A',
    description: 'A fast-paced 3D endless runner where you steer a rolling ball down a steep, randomized neon track.',
    category: 'Arcade'
  },
  {
    id: 'subway-surfers',
    name: 'Subway Surfers',
    url: 'https://subwaysurfers.io/',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/2c/b6/06/2cb606cd-7784-07bf-2c3a-e3ba376dec68/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    color: '#facc15',
    defaultPortrait: true,
    description: 'A highly popular 2012 endless runner where you dodge trains, swipe obstacles, and collect coins on hoverboards.',
    category: 'Arcade'
  },
  {
    id: 'fnf',
    name: 'Friday Night Funkin\'',
    url: 'https://brunoiscool2.github.io/fnf/',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/7f/40/e9/7f40e93d-18b8-a9f7-f98f-8bcb0c219ed9/AppIcon-0-0-1x_U007emarketing-0-11-0-P3-85-220.png/512x512bb.jpg',
    color: '#FF1493',
    description: 'A 2020 open-source rhythm game featuring catchy rap battles, memorable characters, and a massive modding community.',
    category: 'Arcade'
  },
  {
    id: 'geometry-dash',
    name: 'Geometry Dash',
    url: 'https://web-dashers.github.io/',
    image: 'https://steamcdn-a.akamaihd.net/steam/apps/322170/header.jpg',
    color: '#00FFFF',
    description: 'A challenging 2013 rhythm-based platformer where you jump and fly your icon through danger to upbeat electronic music.',
    category: 'Platformer'
  },
  {
    id: 'shell-shockers',
    name: 'Shell Shockers',
    url: 'https://shellshock.io/',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/11/b0/d6/11b0d6e0-3e89-0dfd-b445-7d299d00b33f/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    color: '#facc15',
    description: 'A unique multiplayer first-person shooter where you play as an egg equipped with an arsenal of varied weaponry.',
    category: 'Shooter'
  },
  {
    id: 'smash-karts',
    name: 'Smash Karts',
    url: 'https://smashkarts.com/',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/20/b3/08/20b3085b-14b3-a0bf-3e58-c4cc7ffaa048/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    color: '#39ff14',
    description: 'A multiplayer 3D kart racing game featuring weapons, chaotic power-ups, and intense arena battles.',
    category: 'Action'
  },
  {
    id: 'paper-io-2',
    name: 'Paper.io 2',
    url: 'https://paper-io.com/',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/c9/d7/80/c9d78046-a119-b893-eace-abf59653e560/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    color: '#FF00FF',
    description: 'A competitive territory-capturing game where you draw shapes to expand your color across a shared flat arena.',
    category: 'Arcade'
  },
  {
    id: 'drive-mad',
    name: 'Drive Mad',
    url: 'https://brunoiscool2.github.io/games1/drivemad/',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/3b/0a/e1/3b0ae123-071f-b60d-9434-1bf69a7552af/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    color: '#FF8C00',
    description: 'A quirky physics-based driving game where you navigate wacky 4x4 vehicles over blocky, challenging terrain.',
    category: 'Action'
  },
  {
    id: 'snake-io',
    name: 'Snake.io',
    url: 'https://brunoiscool2.github.io/games3/snakeio/',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/84/53/31/845331ee-e088-5438-377b-b82d60845e93/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    color: '#00FF00',
    description: 'A modernized competitive version of the classic Snake game featuring multiplier elements and customizable skins.',
    category: 'Arcade'
  },
  {
    id: 'tomb-of-the-mask',
    name: 'Tomb of the Mask',
    url: 'https://beta-brunysixl-v3.onrender.com/games/selfhosted/tombofthemask/index.html',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/4c/b3/8e/4cb38eef-73f9-fd90-94d7-a8dcbd90ab32/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    color: '#FFD700',
    defaultPortrait: true,
    description: 'A fast-paced retro arcade game where you swipe to move a masked explorer through winding vertical labyrinths.',
    category: 'Arcade'
  },
  {
    id: '2v2-io',
    name: '2v2.io',
    url: 'https://2v2.io/',
    image: 'https://2v2.io/favicon/android-chrome-512x512.png',
    color: '#ff3366',
    description: 'A multiplayer tactical browser game featuring intense team-based 2v2 competitive gameplay.',
    category: 'Action'
  },
  {
    id: 'basket-random',
    name: 'Basket Random',
    url: 'https://2048taylorswift.github.io/basketrandom/',
    image: 'https://play-lh.googleusercontent.com/gP8T5Z1O-ngxIloiwcBZzrzyLPYDp0R_1BDNKUDZboIRPVImeyWI8-7aExvB9gAGNKc=w512',
    color: '#ff8c00',
    description: 'A hilarious physics-based basketball game where you try to score with wacky characters and unpredictable controls.',
    category: 'Sports'
  },
  {
    id: 'flappy-bird',
    name: 'Floppy Bird',
    url: 'https://nebezb.com/floppybird/',
    image: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Flappy_Bird_icon.png',
    color: '#ff3366',
    defaultPortrait: true,
    description: 'A simple, highly addictive endless sidescroller inspired by the 2013 mobile hit Flappy Bird, testing reaction speed.',
    category: 'Arcade'
  },
  {
    id: 'monkey-mart',
    name: 'Monkey Mart',
    url: 'https://monkey-mart.io/',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/5c/09/44/5c094471-f115-c8b9-6df0-559630eebc4e/AppIcon-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg',
    color: '#8b4513',
    description: 'An idle tycoon arcade game where you slowly build, manage, and expand a supermarket run entirely by monkeys.',
    category: 'Simulation'
  },
  {
    id: 'crossy-road',
    name: 'Crossy Road',
    url: 'https://crossy-road.io/',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/1f/f3/9c/1ff39cc7-a4af-4d4a-e8af-b3bdcb9028a9/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    color: '#39ff14',
    defaultPortrait: true,
    description: 'A 2014 voxel-style arcade game inspired by Frogger, challenging players to relentlessly cross treacherous rivers and highways.',
    category: 'Arcade'
  },
  {
    id: 'bitlife',
    name: 'BitLife',
    url: 'https://bitlifefree.io/',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/83/17/fe/8317feb8-8517-f350-40e4-cc547f732210/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    color: '#ff3366',
    defaultPortrait: true,
    description: 'A popular text-based life simulation game where every narrative choice you make dictates your character\'s timeline.',
    category: 'Simulation'
  },
  {
    id: 'rooftop-snipers',
    name: 'Rooftop Snipers',
    url: 'https://jasongamesdev.github.io/rooftop-snipers/',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple117/v4/5b/d1/d4/5bd1d492-2a77-7924-93dd-97685f1ce8b8/mzl.rbxmiwkz.png/512x512bb.jpg',
    color: '#eb4034',
    description: 'Rooftop Snipers is a chaotic 2-player pixelated shooter where you try to knock your opponent off the roof.',
    category: 'Shooter'
  }
];

const VitaClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="flex items-center gap-2 select-none font-mono">
      <span className="text-[11px] font-bold tracking-wider text-white">
        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
      </span>
      <span className="text-[9px] text-gray-400 font-semibold tracking-widest hidden sm:inline">
        {days[currentTime.getDay()]} {currentTime.getMonth() + 1}/{currentTime.getDate()}
      </span>
    </div>
  );
};

export default function App() {
  const [games, setGames] = useState<Game[]>(DEFAULT_GAMES);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [portraitMode, setPortraitMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSettings, setShowSettings] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchingGame, setLaunchingGame] = useState<Game | null>(null);
  const [previewGame, setPreviewGame] = useState<Game | null>(null);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('vita-favorites') || localStorage.getItem('ps4-favorites') || '[]');
    } catch {
      return [];
    }
  });

  // App loads immediately in handheld mode
  const [hasInteracted, setHasInteracted] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Handheld simulation states
  const [focusedGameIndex, setFocusedGameIndex] = useState(0);
  const [bgmMuted, setBgmMuted] = useState(() => {
    try {
      const saved = localStorage.getItem('vita-bgm-muted');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [bgmVolume, setBgmVolume] = useState(() => {
    try {
      const saved = localStorage.getItem('vita-bgm-volume');
      return saved !== null ? JSON.parse(saved) : 0.35;
    } catch {
      return 0.35;
    }
  });
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('vita-bgm-muted', JSON.stringify(bgmMuted));
    } catch {}
  }, [bgmMuted]);

  useEffect(() => {
    try {
      localStorage.setItem('vita-bgm-volume', JSON.stringify(bgmVolume));
    } catch {}
  }, [bgmVolume]);

  // Sync focused index with bounds
  useEffect(() => {
    setFocusedGameIndex(0);
  }, [selectedCategory, searchQuery]);

  const [userSettings, setUserSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('vita-settings') || localStorage.getItem('ps2-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        let theme: VitaTheme = 'vita_black_blue';
        if (parsed.screensaverTheme === 'vita_black_blue') theme = 'vita_black_blue';
        else if (parsed.screensaverTheme === 'vita_custom') theme = 'vita_custom';
        else if (parsed.screensaverTheme === 'firewatch_purple') theme = 'vita_cosmic_purple';
        else if (parsed.screensaverTheme === 'neon') theme = 'vita_tokyo_neon';
        else if (parsed.screensaverTheme === 'firewatch' || parsed.screensaverTheme === 'classic') theme = 'vita_oled_blue';
        else if (parsed.screensaverTheme === 'dark') theme = 'vita_stealth_carbon';
        else if (['vita_black_blue', 'vita_oled_blue', 'vita_cosmic_purple', 'vita_tokyo_neon', 'vita_emerald', 'vita_stealth_carbon', 'vita_custom'].includes(parsed.screensaverTheme)) {
          theme = parsed.screensaverTheme;
        }
        return {
          displayName: parsed.displayName || 'VITA·PLAYER_1',
          screensaverSpeed: (parsed.screensaverSpeed || 'Normal') as 'Slow' | 'Normal' | 'Hyper' | 'Off',
          screensaverTheme: theme,
          customWaves: parsed.customWaves || {
            bgColor: '#000000',
            waveColor1: '#1e90ff',
            waveColor2: '#00e5ff'
          }
        };
      }
    } catch {}
    return {
      displayName: 'VITA·PLAYER_1',
      screensaverSpeed: 'Normal' as 'Slow' | 'Normal' | 'Hyper' | 'Off',
      screensaverTheme: 'vita_black_blue' as VitaTheme,
      customWaves: {
        bgColor: '#000000',
        waveColor1: '#1e90ff',
        waveColor2: '#00e5ff'
      }
    };
  });

  // Theme variable calculator for PS Vita aesthetics
  const getThemeStyles = () => {
    const theme = userSettings.screensaverTheme;
    if (theme === 'vita_black_blue') {
      return {
        name: 'Black & Blue',
        accent: '#38bdf8',
        accentHover: '#0ea5e9',
        accentSecondary: '#1d4ed8',
        accentBg: 'bg-sky-500/20',
        accentBgHover: 'hover:bg-sky-500/30',
        border: 'border-sky-400/40',
        borderHover: 'group-hover:border-sky-400/80',
        text: 'text-sky-400',
        glow: 'shadow-[0_0_24px_rgba(56,189,248,0.45)]',
        glowHover: 'group-hover:shadow-[0_0_32px_rgba(56,189,248,0.65)]',
        cardBg: 'bg-black/95',
        pillBg: 'bg-sky-500/25',
        pillText: 'text-sky-300',
        buttonBg: 'bg-sky-400',
        buttonText: 'text-neutral-950',
      };
    } else if (theme === 'vita_custom') {
      const w1 = userSettings.customWaves?.waveColor1 || '#1e90ff';
      const w2 = userSettings.customWaves?.waveColor2 || '#00e5ff';
      return {
        name: 'Custom Waves',
        accent: w1,
        accentHover: w2,
        accentSecondary: w2,
        accentBg: 'bg-sky-500/20',
        accentBgHover: 'hover:bg-sky-500/30',
        border: 'border-white/40',
        borderHover: 'group-hover:border-white/80',
        text: 'text-sky-300',
        glow: 'shadow-[0_0_24px_rgba(56,189,248,0.35)]',
        glowHover: 'group-hover:shadow-[0_0_32px_rgba(56,189,248,0.6)]',
        cardBg: 'bg-black/95',
        pillBg: 'bg-white/15',
        pillText: 'text-white',
        buttonBg: 'bg-sky-400',
        buttonText: 'text-neutral-950',
      };
    } else if (theme === 'vita_cosmic_purple') {
      return {
        name: 'Cosmic Purple',
        accent: '#c084fc',
        accentHover: '#a855f7',
        accentSecondary: '#f472b6',
        accentBg: 'bg-purple-500/15',
        accentBgHover: 'hover:bg-purple-500/25',
        border: 'border-purple-400/30',
        borderHover: 'group-hover:border-purple-400/70',
        text: 'text-purple-400',
        glow: 'shadow-[0_0_20px_rgba(192,132,252,0.3)]',
        glowHover: 'group-hover:shadow-[0_0_28px_rgba(192,132,252,0.5)]',
        cardBg: 'bg-[#0f0720]/85',
        pillBg: 'bg-purple-500/20',
        pillText: 'text-purple-300',
        buttonBg: 'bg-purple-500',
        buttonText: 'text-neutral-950',
      };
    } else if (theme === 'vita_tokyo_neon') {
      return {
        name: 'Tokyo Neon',
        accent: '#22d3ee',
        accentHover: '#06b6d4',
        accentSecondary: '#f43f5e',
        accentBg: 'bg-cyan-500/15',
        accentBgHover: 'hover:bg-cyan-500/25',
        border: 'border-cyan-400/30',
        borderHover: 'group-hover:border-cyan-400/70',
        text: 'text-cyan-400',
        glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
        glowHover: 'group-hover:shadow-[0_0_28px_rgba(34,211,238,0.5)]',
        cardBg: 'bg-[#050e1f]/85',
        pillBg: 'bg-cyan-500/20',
        pillText: 'text-cyan-300',
        buttonBg: 'bg-cyan-400',
        buttonText: 'text-neutral-950',
      };
    } else if (theme === 'vita_emerald') {
      return {
        name: 'Cyber Emerald',
        accent: '#34d399',
        accentHover: '#10b981',
        accentSecondary: '#2dd4bf',
        accentBg: 'bg-emerald-500/15',
        accentBgHover: 'hover:bg-emerald-500/25',
        border: 'border-emerald-400/30',
        borderHover: 'group-hover:border-emerald-400/70',
        text: 'text-emerald-400',
        glow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]',
        glowHover: 'group-hover:shadow-[0_0_28px_rgba(52,211,153,0.5)]',
        cardBg: 'bg-[#031512]/85',
        pillBg: 'bg-emerald-500/20',
        pillText: 'text-emerald-300',
        buttonBg: 'bg-emerald-400',
        buttonText: 'text-neutral-950',
      };
    } else if (theme === 'vita_stealth_carbon') {
      return {
        name: 'Stealth Carbon',
        accent: '#f1f5f9',
        accentHover: '#cbd5e1',
        accentSecondary: '#94a3b8',
        accentBg: 'bg-slate-300/15',
        accentBgHover: 'hover:bg-slate-300/25',
        border: 'border-slate-300/30',
        borderHover: 'group-hover:border-slate-300/70',
        text: 'text-slate-200',
        glow: 'shadow-[0_0_20px_rgba(241,245,249,0.2)]',
        glowHover: 'group-hover:shadow-[0_0_28px_rgba(241,245,249,0.4)]',
        cardBg: 'bg-[#0d1017]/85',
        pillBg: 'bg-slate-400/20',
        pillText: 'text-slate-200',
        buttonBg: 'bg-slate-100',
        buttonText: 'text-neutral-950',
      };
    } else {
      // Classic OLED Crystal Blue
      return {
        name: 'OLED Crystal Blue',
        accent: '#38bdf8',
        accentHover: '#0ea5e9',
        accentSecondary: '#818cf8',
        accentBg: 'bg-sky-500/15',
        accentBgHover: 'hover:bg-sky-500/25',
        border: 'border-sky-400/30',
        borderHover: 'group-hover:border-sky-400/70',
        text: 'text-sky-400',
        glow: 'shadow-[0_0_20px_rgba(56,189,248,0.3)]',
        glowHover: 'group-hover:shadow-[0_0_28px_rgba(56,189,248,0.5)]',
        cardBg: 'bg-[#040c1d]/85',
        pillBg: 'bg-sky-500/20',
        pillText: 'text-sky-300',
        buttonBg: 'bg-sky-400',
        buttonText: 'text-neutral-950',
      };
    }
  };

  const themeStyles = getThemeStyles();

  const updateSetting = <K extends keyof typeof userSettings>(key: K, value: typeof userSettings[K]) => {
    setUserSettings(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('vita-settings', JSON.stringify(next));
      return next;
    });
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      ps2Audio.playHoverSound();
      carouselRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      ps2Audio.playHoverSound();
      carouselRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  // Dedicated PS Vita PlayStation Store Main Theme music controller
  const startMusic = useCallback(() => {
    if (bgmMuted || activeGame || isLaunching) return;

    if (!bgmRef.current) {
      // Create audio element with local file and remote fallback
      const audio = new Audio(VITA_MUSIC_LOCAL);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = bgmMuted ? 0 : bgmVolume;

      audio.addEventListener('playing', () => setIsMusicPlaying(true));
      audio.addEventListener('pause', () => setIsMusicPlaying(false));
      audio.addEventListener('ended', () => setIsMusicPlaying(false));

      audio.addEventListener('error', (e) => {
        console.warn("Local audio source error, switching to remote stream:", e);
        if (audio.src.includes(VITA_MUSIC_LOCAL)) {
          audio.src = VITA_MUSIC_REMOTE;
          audio.load();
          audio.play().catch(() => {});
        }
      });

      bgmRef.current = audio;
    }

    if (bgmRef.current) {
      bgmRef.current.volume = bgmMuted ? 0 : bgmVolume;
      const playPromise = bgmRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMusicPlaying(true);
          })
          .catch((err) => {
            console.log("Autoplay held by browser pending user gesture:", err);
            setIsMusicPlaying(false);
          });
      }
    }
  }, [bgmMuted, activeGame, isLaunching, bgmVolume]);

  const pauseMusic = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      setIsMusicPlaying(false);
    }
  }, []);

  // Update volume and pause/resume based on active game or mute state
  useEffect(() => {
    if (activeGame || isLaunching) {
      pauseMusic();
    } else if (!bgmMuted) {
      startMusic();
    } else {
      pauseMusic();
    }
  }, [activeGame, isLaunching, bgmMuted, startMusic, pauseMusic]);

  // Volume sync
  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = bgmMuted ? 0 : bgmVolume;
    }
  }, [bgmVolume, bgmMuted]);

  // Global user interaction listener to kick off audio on ANY click/tap/keypress
  useEffect(() => {
    const handleGesture = () => {
      if (!bgmMuted && !activeGame && !isLaunching && (!bgmRef.current || bgmRef.current.paused)) {
        startMusic();
      }
    };

    window.addEventListener('pointerdown', handleGesture);
    window.addEventListener('click', handleGesture);
    window.addEventListener('keydown', handleGesture);
    window.addEventListener('touchstart', handleGesture);

    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, [bgmMuted, activeGame, isLaunching, startMusic]);

  // PS4 Gamification Achievement Generator
  const getGameTrophies = (gameId: string) => {
    const trophies = {
      'pokemon-silver': [
        { name: "Johto Champion 🏆", desc: "Defeat Lance and the Elite Four", type: "Gold", unlocked: true },
        { name: "Master Ball Legend 🌌", desc: "Catch Lugia or Ho-Oh using appropriate resources", type: "Silver", unlocked: true },
        { name: "Pokédex Expansion 💎", desc: "Log 100 entries in your regional Pokédex", type: "Bronze", unlocked: false }
      ],
      'sonic-robo-blast-2': [
        { name: "Chaos Master 🏆", desc: "Retrieve all 7 Chaos Emeralds", type: "Gold", unlocked: true },
        { name: "Robotnik's Ruin 🚀", desc: "Defeat Eggman at Greenflower Zone", type: "Silver", unlocked: true },
        { name: "SpeedRunner Zone 🌀", desc: "Finish any stage under 45 seconds", type: "Bronze", unlocked: false }
      ],
      'sonic-mania': [
        { name: "Encore Master 🏆", desc: "Clear Sonic Mania with all characters", type: "Gold", unlocked: false },
        { name: "Spin Dash Master ⚡", desc: "Maintain full speed spin dash momentum for 5 seconds", type: "Silver", unlocked: true },
        { name: "Triple Zone 🌀", desc: "Clear Titanic Monarch Zone Stage 2", type: "Bronze", unlocked: true }
      ],
      'fnaf-1': [
        { name: "The Sixth Night 🏆", desc: "Survive the entire 6th night shift", type: "Gold", unlocked: false },
        { name: "Golden Bear 🐻", desc: "Experience the secret golden hallucination", type: "Silver", unlocked: true },
        { name: "Energy Conservator 💡", desc: "Complete any night with 15%+ power left", type: "Bronze", unlocked: true }
      ],
      'fnaf-2': [
        { name: "Toy Box Clean 🏆", desc: "Survive the Custom Night (10/20 Mode)", type: "Gold", unlocked: false },
        { name: "Music Box Winder 🎶", desc: "Keep Marionette asleep for 3 minutes", type: "Silver", unlocked: true },
        { name: "New Mask Fit 🎭", desc: "Successfully fool Withered Foxy", type: "Bronze", unlocked: true }
      ],
      'retro-bowl': [
        { name: "Retro Bowl Champ 🏆", desc: "Win the Retro Bowl Franchise Trophy", type: "Gold", unlocked: true },
        { name: "Undefeated Season 🔥", desc: "Achieve a perfect 17-0 regular record", type: "Silver", unlocked: true },
        { name: "Hall Of Fame Coach 👔", desc: "Draft a 5-star offensive strategist", type: "Bronze", unlocked: true }
      ],
      'slope': [
        { name: "Infinity Rolling 🏆", desc: "Achieve a score of 150 points or higher", type: "Gold", unlocked: false },
        { name: "Hazard Dodger 🚩", desc: "Dodge 40 red blocks in a single roll", type: "Silver", unlocked: true },
        { name: "Neon Blitz ⚡", desc: "Reach multiplier level 4", type: "Bronze", unlocked: true }
      ],
      'subway-surfers': [
        { name: "High-Rise Runner 🏆", desc: "Amass a score of 1,000,000 inside a run", type: "Gold", unlocked: true },
        { name: "Jetpack Joyride 🚀", desc: "Fly with jetpacks for 20 seconds total", type: "Silver", unlocked: true },
        { name: "Hoverboard Expert 🛹", desc: "Survive 5 crashes using boards", type: "Bronze", unlocked: false }
      ],
      'geometry-dash': [
        { name: "Demon Conqueror 🏆", desc: "Slay any official Demon level map", type: "Gold", unlocked: false },
        { name: "Icon Collector 📦", desc: "Unlock 20 distinct custom icon skins", type: "Silver", unlocked: true },
        { name: "Perfect Sync 🔊", desc: "Clear Stereo Madness in normal mode", type: "Bronze", unlocked: true }
      ],
      'eaglercraft': [
        { name: "Minecraft End 🏆", desc: "Defeat the Ender Dragon on default setting", type: "Gold", unlocked: true },
        { name: "Portal Opener 🌌", desc: "Build a Nether Portal using obsidian", type: "Silver", unlocked: true },
        { name: "Diamond Finder 💎", desc: "Locate and mine your first Diamond vein", type: "Bronze", unlocked: true }
      ],
      'soflo-wheelie-life': [
        { name: "Highway Wheelie King 🏆", desc: "Hold a continuous wheelie across the entire bridge", type: "Gold", unlocked: true },
        { name: "Stunt Master 🏍️", desc: "Chain 5 consecutive trick combos without dropping", type: "Silver", unlocked: true },
        { name: "Garage Upgrade 🔧", desc: "Unlock and switch to a custom upgraded bike", type: "Bronze", unlocked: true }
      ]
    };
    return trophies[gameId as keyof typeof trophies] || [
      { name: "High-Score Legend 🏆", desc: "Unlock all game categories and cards", type: "Gold", unlocked: true },
      { name: "Power Player 🕹️", desc: "Establish local progress on this disk", type: "Silver", unlocked: true },
      { name: "First Stage Clear 🚩", desc: "Initiate game sector mapping protocol", type: "Bronze", unlocked: true }
    ];
  };

  useEffect(() => {
    localStorage.setItem('ps4-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (gameId: string) => {
    setFavorites(prev => 
      prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId]
    );
  };

  const handleOpenGame = (game: Game) => {
    ps2Audio.playVitaChime();
    setLaunchingGame(game);
    setIsLaunching(true);

    const timer = setTimeout(() => {
      setIsLaunching(false);
      setActiveGame(game);
      setPortraitMode(!!game.defaultPortrait);
      setLaunchingGame(null);
    }, 750);

    return () => clearTimeout(timer);
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                            (selectedCategory === 'Favorites' ? favorites.includes(game.id) : game.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Center active tile inside horizontally scrolled PS4 game deck carousel
  const scrollTileIntoView = (index: number) => {
    if (carouselRef.current) {
      const tileWidth = 196; // 180px card + 16px gap-4 is 196px
      const containerWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: index * tileWidth - containerWidth / 2 + 98,
        behavior: 'smooth'
      });
    }
  };

  // Keyboard navigation listener mimic d-pad controller setup
  useEffect(() => {
    const handleNavigationKeys = (e: KeyboardEvent) => {
      if (activeGame || isLaunching || showSettings) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        ps2Audio.playHoverSound();
        setFocusedGameIndex(prev => {
          const next = prev > 0 ? prev - 1 : Math.max(0, filteredGames.length - 1);
          scrollTileIntoView(next);
          return next;
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        ps2Audio.playHoverSound();
        setFocusedGameIndex(prev => {
          const next = prev < filteredGames.length - 1 ? prev + 1 : 0;
          scrollTileIntoView(next);
          return next;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const highlightedGame = filteredGames[focusedGameIndex];
        if (highlightedGame) {
          ps2Audio.playClickSound();
          handleOpenGame(highlightedGame);
        }
      }
    };

    window.addEventListener('keydown', handleNavigationKeys);
    return () => window.removeEventListener('keydown', handleNavigationKeys);
  }, [filteredGames, focusedGameIndex, activeGame, isLaunching, showSettings]);


  return (
    <>
      <VitaAtmosphere 
        theme={userSettings.screensaverTheme} 
        customWaves={userSettings.customWaves}
        speed={userSettings.screensaverSpeed}
      />

      {/* Main Console HUD */}
      <AnimatePresence>
        {!activeGame && hasInteracted && !isLaunching && (
          <motion.div 
            key="maingrid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen relative z-10 flex flex-col text-white font-sans overflow-x-hidden"
          >
            {/* Handheld System Header (Galaxy Games) */}
            <header className="flex flex-col sm:flex-row justify-between items-center gap-3 px-6 sm:px-10 w-full py-4 select-none relative z-30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.35)]">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-base sm:text-lg font-black tracking-wider text-white uppercase select-none leading-tight font-sans">
                    Galaxy Games
                  </h1>
                  <span className="text-[8px] font-mono tracking-widest text-sky-300/70 uppercase">
                    PS VITA LIVEAREA
                  </span>
                </div>
              </div>

              {/* Right Utility Group: Search, Clock, Audio, Settings (NO battery, NO notifications) */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {/* Search Pill */}
                <div className="relative w-full sm:w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-full pl-8 pr-7 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-sky-400 transition-all font-sans"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Digital Clock */}
                <div className="hidden sm:block">
                  <VitaClock />
                </div>

                {/* Sound Mute/Unmute & Play indicator */}
                <button
                  onClick={() => {
                    ps2Audio.playVitaBubblePop();
                    const nextMuted = !bgmMuted;
                    setBgmMuted(nextMuted);
                    if (!nextMuted) {
                      startMusic();
                    } else {
                      pauseMusic();
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1.5 font-mono text-[10px] ${
                    !bgmMuted
                      ? isMusicPlaying
                        ? 'bg-sky-500/20 border-sky-400/50 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.35)]'
                        : 'bg-amber-500/20 border-amber-400/50 text-amber-300 animate-pulse'
                      : 'bg-white/5 border-white/15 text-gray-400 hover:text-white'
                  }`}
                  title={
                    bgmMuted
                      ? "Unmute PS Vita Menu Music (PlayStation Store Theme)"
                      : isMusicPlaying
                      ? "Mute PS Vita Menu Music"
                      : "Click to start PS Vita Menu Music"
                  }
                >
                  {bgmMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <Volume2 className={`w-3.5 h-3.5 ${isMusicPlaying ? 'text-sky-400' : 'text-amber-400'}`} />
                  )}
                  <span className="hidden min-[520px]:inline font-bold">
                    {bgmMuted ? 'MUTED' : isMusicPlaying ? 'MUSIC ON' : 'PLAY MUSIC'}
                  </span>
                </button>

                {/* System Settings */}
                <button 
                  onClick={() => {
                    ps2Audio.playVitaBubblePop();
                    setShowSettings(true);
                  }}
                  className="p-2 border border-white/15 hover:border-white/35 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center"
                  title="Settings"
                >
                  <Settings className="w-4 h-4 text-white" />
                </button>
              </div>
            </header>

            {/* Category Ribbon */}
            <div className="flex justify-start sm:justify-center items-center gap-2 px-6 sm:px-10 py-1.5 w-full overflow-x-auto no-scrollbar select-none shrink-0 relative z-30">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    ps2Audio.playVitaBubblePop();
                    setSelectedCategory(category);
                  }}
                  className={`px-4 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === category 
                      ? 'text-sky-300 border-sky-400/60 bg-sky-500/20 shadow-[0_0_15px_rgba(56,189,248,0.3)] scale-105 backdrop-blur-md' 
                      : 'text-gray-400 border-white/10 hover:text-white hover:bg-white/5 bg-black/25'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* PS Vita Iconic Circle Games Grid */}
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 z-20 overflow-y-auto no-scrollbar">
              {filteredGames.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-sans text-sm">
                  No games found matching your search.
                </div>
              ) : (
                <div className="grid grid-cols-2 min-[440px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-10 gap-x-4 sm:gap-x-6 justify-items-center items-start">
                  {filteredGames.map((game) => {
                    const isFavorite = favorites.includes(game.id);
                    return (
                      <div
                        key={game.id}
                        className="flex flex-col items-center group relative select-none"
                      >
                        {/* The Iconic Circular Vita Bubble */}
                        <motion.div
                          whileHover={{ scale: 1.1, y: -6 }}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => {
                            ps2Audio.playVitaBubblePop();
                            setPreviewGame(game);
                          }}
                          className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-30 md:h-30 rounded-full cursor-pointer transition-shadow duration-300 border-2 border-white/25 group-hover:border-sky-300 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.65)]"
                          style={{
                            boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                          }}
                        >
                          {/* Inner Circle with artwork */}
                          <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                            <img
                              src={game.image}
                              alt={game.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
                            />
                          </div>

                          {/* 3D Vita Glass Specular Highlight (Iconic Bubble Sheen) */}
                          <div 
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{
                              background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.2) 34%, transparent 64%)'
                            }}
                          />

                          {/* Physical 3D Bottom Sphere Shadow */}
                          <div 
                            className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_0_-8px_16px_rgba(0,0,0,0.65)]"
                          />

                          {/* Quick Favorite Heart on bubble */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              ps2Audio.playVitaBubblePop();
                              toggleFavorite(game.id);
                            }}
                            className={`absolute top-0 right-0 p-1.5 rounded-full transition-all duration-200 z-20 ${
                              isFavorite 
                                ? 'text-red-400 bg-black/60 shadow-sm' 
                                : 'text-white/40 hover:text-white bg-black/40 opacity-0 group-hover:opacity-100'
                            }`}
                            title={isFavorite ? "Remove favorite" : "Add to favorites"}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                          </button>
                        </motion.div>

                        {/* Bubble Label Below */}
                        <span className="mt-2.5 text-xs sm:text-sm font-semibold text-white tracking-wide text-center truncate max-w-[100px] sm:max-w-[120px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                          {game.name}
                        </span>
                        <span className="text-[9.5px] text-sky-300/80 font-medium tracking-wider text-center uppercase">
                          {game.category}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simplified PS Vita LiveArea Game Start Modal */}
      <AnimatePresence>
        {previewGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewGame(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#051129]/95 border border-sky-400/35 rounded-3xl p-6 sm:p-8 relative shadow-[0_0_50px_rgba(14,165,233,0.3)] flex flex-col items-center text-center overflow-hidden"
            >
              {/* Top gloss line */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => {
                  ps2Audio.playVitaBubblePop();
                  setPreviewGame(null);
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Circular Bubble Hero */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.5)] mb-4 shrink-0">
                <img
                  src={previewGame.image}
                  alt={previewGame.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {/* Glass specular shine */}
                <div 
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.2) 34%, transparent 64%)'
                  }}
                />
                <div className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_0_-8px_16px_rgba(0,0,0,0.65)]" />
              </div>

              {/* Game Title & Category */}
              <div className="space-y-1 mb-3">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {previewGame.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide pt-1">
                  {previewGame.name}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-gray-300/90 leading-relaxed max-w-sm mb-6">
                {previewGame.description || "Relive the nostalgic handheld gaming experience on Galaxy Games."}
              </p>

              {/* Action Buttons: START, Favorite, Open in Tab */}
              <div className="flex items-center gap-3 w-full justify-center">
                <button
                  onClick={() => {
                    const target = previewGame;
                    setPreviewGame(null);
                    handleOpenGame(target);
                  }}
                  className="relative px-9 py-3 rounded-full font-black uppercase tracking-[0.2em] text-xs sm:text-sm text-neutral-950 bg-gradient-to-r from-sky-400 to-cyan-300 hover:from-sky-300 hover:to-cyan-200 transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.5)] hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
                >
                  {/* Gloss reflection on START pill */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-white/40 rounded-t-full pointer-events-none" />
                  <Play className="w-4 h-4 fill-current shrink-0" />
                  <span>START</span>
                </button>

                <button
                  onClick={() => {
                    ps2Audio.playVitaBubblePop();
                    toggleFavorite(previewGame.id);
                  }}
                  className={`p-3 rounded-full border transition-all cursor-pointer ${
                    favorites.includes(previewGame.id)
                      ? 'border-red-500 bg-red-950/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                      : 'border-white/20 bg-white/5 text-gray-300 hover:text-white hover:border-white/40'
                  }`}
                  title={favorites.includes(previewGame.id) ? "Remove favorite" : "Add to favorites"}
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(previewGame.id) ? 'fill-current' : ''}`} />
                </button>

                <a
                  href={previewGame.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => ps2Audio.playVitaBubblePop()}
                  className="p-3 rounded-full border border-white/20 bg-white/5 text-gray-300 hover:text-white hover:border-white/40 transition-all cursor-pointer"
                  title="Open in external tab"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal - LiveArea Handheld System Settings */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-[#050b18]/95 border border-white/20 shadow-[0_0_50px_rgba(34,211,238,0.15)] rounded-2xl relative overflow-hidden font-sans text-gray-200"
            >
              {/* Gloss highlight on upper edge */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
              
              <div className="flex justify-between items-center px-6 py-4.5 border-b border-white/10 relative z-10 bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${themeStyles.text} bg-current animate-pulse shadow-[0_0_8px_currentColor]`} />
                  <h2 className="text-xs font-black tracking-[0.22em] uppercase text-white font-mono">
                    LIVEAREA SYSTEM CONFIGURATION
                  </h2>
                </div>
                <button 
                  onClick={() => {
                    ps2Audio.playVitaBubblePop();
                    setShowSettings(false);
                  }}
                  className="p-1.5 border border-white/15 hover:border-white/40 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-6 relative z-10 space-y-4 text-xs">
                <div className="space-y-3">
                  {/* Console Name row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                    <span className="uppercase tracking-widest text-gray-400 text-[10px] font-mono">Player Nickname</span>
                    <input 
                      type="text" 
                      value={userSettings.displayName}
                      onChange={(e) => {
                        updateSetting('displayName', e.target.value);
                      }}
                      onFocus={() => ps2Audio.playVitaBubblePop()}
                      className="bg-black/80 border border-white/15 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-cyan-400 text-[11px] tracking-wider uppercase w-48 font-mono"
                    />
                  </div>

                  {/* OLED Color Theme row */}
                  <div className="flex flex-col gap-2.5 p-3.5 bg-white/[0.02] border border-white/10 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="uppercase tracking-widest text-gray-400 text-[10px] font-mono">OLED Atmosphere Waves</span>
                      <span className={`text-[9px] font-mono font-bold ${themeStyles.text} uppercase`}>{themeStyles.name}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {[
                        { id: 'vita_black_blue', label: 'Black & Blue', color: '#1e90ff', secondaryColor: '#000000' },
                        { id: 'vita_oled_blue', label: 'Crystal Blue', color: '#38bdf8', secondaryColor: '#030d22' },
                        { id: 'vita_cosmic_purple', label: 'Cosmic Purple', color: '#c084fc', secondaryColor: '#0f0720' },
                        { id: 'vita_tokyo_neon', label: 'Tokyo Neon', color: '#22d3ee', secondaryColor: '#050e1f' },
                        { id: 'vita_emerald', label: 'Cyber Emerald', color: '#34d399', secondaryColor: '#031512' },
                        { id: 'vita_stealth_carbon', label: 'Stealth Carbon', color: '#cbd5e1', secondaryColor: '#0d1017' },
                        { id: 'vita_custom', label: 'Custom Waves', color: userSettings.customWaves?.waveColor1 || '#1e90ff', secondaryColor: userSettings.customWaves?.bgColor || '#000000', isCustom: true },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            ps2Audio.playVitaBubblePop();
                            updateSetting('screensaverTheme', t.id as VitaTheme);
                          }}
                          className={`px-2.5 py-2 border rounded-xl flex items-center gap-2 transition-all text-[10px] font-mono cursor-pointer ${
                            userSettings.screensaverTheme === t.id
                              ? 'bg-white/15 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-[1.02]'
                              : 'border-white/10 text-gray-400 hover:text-white hover:border-white/30 bg-black/30'
                          }`}
                        >
                          <span 
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm border border-white/20 flex items-center justify-center overflow-hidden" 
                            style={{ 
                              background: `linear-gradient(135deg, ${t.color} 50%, ${t.secondaryColor} 50%)` 
                            }}
                          />
                          <span className="truncate">{t.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Interactive Custom Wave Color Panel */}
                    {(userSettings.screensaverTheme === 'vita_custom' || userSettings.screensaverTheme === 'vita_black_blue') && (
                      <div className="mt-2 pt-3 border-t border-white/10 space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 uppercase">
                          <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
                            <Palette className="w-3 h-3" />
                            <span>Wave Color Customizer</span>
                          </span>
                          <span className="text-[9px] text-gray-500">Live preview active</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {/* Background Color */}
                          <div className="bg-black/60 border border-white/10 rounded-lg p-2 flex flex-col gap-1.5">
                            <span className="text-[9px] font-mono uppercase text-gray-400">Background</span>
                            <div className="flex items-center gap-2">
                              <input 
                                type="color" 
                                value={userSettings.customWaves?.bgColor || '#000000'}
                                onChange={(e) => {
                                  const newCustom: CustomWaveSettings = {
                                    bgColor: e.target.value,
                                    waveColor1: userSettings.customWaves?.waveColor1 || '#1e90ff',
                                    waveColor2: userSettings.customWaves?.waveColor2 || '#00e5ff'
                                  };
                                  updateSetting('customWaves', newCustom);
                                  if (userSettings.screensaverTheme !== 'vita_custom') {
                                    updateSetting('screensaverTheme', 'vita_custom');
                                  }
                                }}
                                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                              />
                              <span className="text-[10px] font-mono text-gray-300 uppercase">
                                {userSettings.customWaves?.bgColor || '#000000'}
                              </span>
                            </div>
                          </div>

                          {/* Wave Color 1 */}
                          <div className="bg-black/60 border border-white/10 rounded-lg p-2 flex flex-col gap-1.5">
                            <span className="text-[9px] font-mono uppercase text-gray-400">Wave 1 (Primary)</span>
                            <div className="flex items-center gap-2">
                              <input 
                                type="color" 
                                value={userSettings.customWaves?.waveColor1 || '#1e90ff'}
                                onChange={(e) => {
                                  const newCustom: CustomWaveSettings = {
                                    bgColor: userSettings.customWaves?.bgColor || '#000000',
                                    waveColor1: e.target.value,
                                    waveColor2: userSettings.customWaves?.waveColor2 || '#00e5ff'
                                  };
                                  updateSetting('customWaves', newCustom);
                                  if (userSettings.screensaverTheme !== 'vita_custom') {
                                    updateSetting('screensaverTheme', 'vita_custom');
                                  }
                                }}
                                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                              />
                              <span className="text-[10px] font-mono text-gray-300 uppercase">
                                {userSettings.customWaves?.waveColor1 || '#1e90ff'}
                              </span>
                            </div>
                          </div>

                          {/* Wave Color 2 */}
                          <div className="bg-black/60 border border-white/10 rounded-lg p-2 flex flex-col gap-1.5">
                            <span className="text-[9px] font-mono uppercase text-gray-400">Wave 2 (Secondary)</span>
                            <div className="flex items-center gap-2">
                              <input 
                                type="color" 
                                value={userSettings.customWaves?.waveColor2 || '#00e5ff'}
                                onChange={(e) => {
                                  const newCustom: CustomWaveSettings = {
                                    bgColor: userSettings.customWaves?.bgColor || '#000000',
                                    waveColor1: userSettings.customWaves?.waveColor1 || '#1e90ff',
                                    waveColor2: e.target.value
                                  };
                                  updateSetting('customWaves', newCustom);
                                  if (userSettings.screensaverTheme !== 'vita_custom') {
                                    updateSetting('screensaverTheme', 'vita_custom');
                                  }
                                }}
                                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                              />
                              <span className="text-[10px] font-mono text-gray-300 uppercase">
                                {userSettings.customWaves?.waveColor2 || '#00e5ff'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Color Swatches */}
                        <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
                          <span className="text-[9px] font-mono text-gray-400 shrink-0">Swatches:</span>
                          {[
                            { label: 'Black & Dodger Blue', bg: '#000000', w1: '#1e90ff', w2: '#00e5ff' },
                            { label: 'Pitch Black & Cyan', bg: '#000000', w1: '#00e5ff', w2: '#38bdf8' },
                            { label: 'Deep Blue & Sky', bg: '#020b1e', w1: '#2563eb', w2: '#60a5fa' },
                            { label: 'Black & Violet', bg: '#000000', w1: '#8b5cf6', w2: '#c084fc' },
                            { label: 'Black & Amber', bg: '#000000', w1: '#f59e0b', w2: '#fbbf24' },
                          ].map(swatch => (
                            <button
                              key={swatch.label}
                              type="button"
                              onClick={() => {
                                ps2Audio.playVitaBubblePop();
                                updateSetting('customWaves', {
                                  bgColor: swatch.bg,
                                  waveColor1: swatch.w1,
                                  waveColor2: swatch.w2
                                });
                                updateSetting('screensaverTheme', 'vita_custom');
                              }}
                              className="px-2 py-1 rounded bg-black/40 border border-white/10 hover:border-white/40 text-[9px] font-mono text-gray-300 hover:text-white shrink-0 flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: swatch.w1 }} />
                              <span>{swatch.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PS Vita Menu Music & Sound Engine */}
                  <div className="flex flex-col gap-2.5 p-3.5 bg-white/[0.02] border border-white/10 rounded-xl font-mono text-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5 text-sky-400" />
                        <span>PS Vita System Menu Music</span>
                      </span>
                      <span className={`text-[9px] font-bold ${!bgmMuted && isMusicPlaying ? 'text-emerald-400' : !bgmMuted ? 'text-amber-400' : 'text-gray-400'}`}>
                        {!bgmMuted && isMusicPlaying ? '● PLAYING (PS STORE THEME)' : !bgmMuted ? 'PAUSED (CLICK TO START)' : 'MUTED'}
                      </span>
                    </div>

                    <div className="text-[9px] text-gray-400 font-sans flex items-center gap-1.5">
                      <span className="text-gray-500 font-mono">TRACK:</span>
                      <span className="text-sky-300 font-mono">05. PlayStation Store - Main Theme</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            ps2Audio.playVitaBubblePop();
                            const nextMuted = !bgmMuted;
                            setBgmMuted(nextMuted);
                            if (!nextMuted) {
                              startMusic();
                            } else {
                              pauseMusic();
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-bold cursor-pointer transition-all ${
                            !bgmMuted && isMusicPlaying
                              ? 'bg-sky-500/20 border-sky-400/50 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                              : !bgmMuted
                              ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                              : 'bg-white/5 border-white/15 text-gray-400 hover:text-white'
                          }`}
                        >
                          {!bgmMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                          <span>{!bgmMuted ? (isMusicPlaying ? 'Music Playing' : 'Start Music') : 'Unmute Music'}</span>
                        </button>

                        <button
                          onClick={() => ps2Audio.playVitaChime()}
                          className="px-3 py-1.5 rounded-lg border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-all font-bold cursor-pointer flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Test Vita Chime</span>
                        </button>
                      </div>

                      {/* Volume Slider */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-[9px] text-gray-400">VOL:</span>
                        <input
                          type="range"
                          min="0.05"
                          max="1.0"
                          step="0.05"
                          value={bgmVolume}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setBgmVolume(val);
                          }}
                          className="w-24 accent-sky-400 cursor-pointer h-1.5 bg-white/20 rounded-lg"
                        />
                        <span className="text-[9px] text-gray-300 w-8">{Math.round(bgmVolume * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    ps2Audio.playVitaBubblePop();
                    setShowSettings(false);
                  }}
                  className="w-full py-3 rounded-full font-black uppercase tracking-[0.25em] transition-all text-[11px] font-sans cursor-pointer shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                  style={{ backgroundColor: themeStyles.accent, color: '#000' }}
                >
                  Save & Return to LiveArea
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Handheld Cartridge ROM Loading Screen */}
      <AnimatePresence>
        {isLaunching && launchingGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-[#020717] flex flex-col items-center justify-center gap-5 select-none font-sans"
          >
            {/* Handheld LiveArea Bubble Launch Transition */}
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: [0.95, 1.08, 0.95] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-sky-400 shadow-[0_0_50px_rgba(56,189,248,0.5)]"
            >
              <img src={launchingGame.image} alt={launchingGame.name} className="w-full h-full object-cover select-none" />
              {/* Glass bubble shine */}
              <div 
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.2) 34%, transparent 64%)'
                }}
              />
              <div className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_0_-8px_16px_rgba(0,0,0,0.65)]" />
            </motion.div>

            <div className="text-center space-y-1">
              <h2 className="text-white text-base tracking-wider uppercase font-extrabold">
                {launchingGame.name}
              </h2>
              <p className="text-xs text-sky-300 font-mono tracking-widest uppercase animate-pulse">
                Loading LiveArea...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Game Player Fullscreen with Custom Handheld Chassis frame */}
      <AnimatePresence>
        {activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#01040a] flex flex-col items-center overflow-x-hidden font-mono"
          >
            {/* Handheld LiveArea Running Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-3.5 bg-black/90 border-b border-white/10 w-full z-10 select-none backdrop-blur-md">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center relative shadow-[0_0_12px_rgba(56,189,248,0.25)]">
                     <Gamepad2 className="w-4 h-4 text-sky-300" />
                   </div>
                   <div className="space-y-[1px]">
                     <h2 className="text-sm font-black tracking-wider text-white uppercase leading-none font-sans">
                       {activeGame.name}
                     </h2>
                     <p className="text-[8.5px] text-sky-400/80 font-semibold tracking-widest font-mono">GALAXY GAMES // PLAYING</p>
                   </div>
                </div>
              
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    ps2Audio.playVitaBubblePop();
                    setPortraitMode(!portraitMode);
                  }}
                  className="px-3.5 py-1.5 bg-white/5 border border-white/15 hover:border-white/35 rounded-full text-[9.5px] tracking-wider uppercase transition-all hidden sm:flex items-center gap-1.5 text-gray-300 font-bold cursor-pointer hover:bg-white/10"
                >
                  {portraitMode ? <Monitor className="w-3.5 h-3.5 text-cyan-400" /> : <Smartphone className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{portraitMode ? 'Landscape' : 'Handheld View'}</span>
                </button>
                <a 
                  href={activeGame.url} 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={() => ps2Audio.playVitaBubblePop()}
                  className="px-3.5 py-1.5 bg-cyan-500/15 border border-cyan-400/40 hover:bg-cyan-500/25 rounded-full text-[9.5px] tracking-wider uppercase transition-all flex items-center gap-1.5 text-cyan-300 font-bold cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                >
                  <span>New Tab</span> <Globe className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => {
                    ps2Audio.playVitaBubblePop();
                    setActiveGame(null);
                  }}
                  className="bg-white/10 hover:bg-red-500/25 text-neutral-300 hover:text-red-300 rounded-full p-1.5 cursor-pointer border border-white/15 hover:border-red-400/40 transition-all font-bold shadow-sm"
                  title="Close LiveArea App"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Embedded Iframe Console Frame Container */}
            <div className={`flex-1 w-full relative flex justify-center items-center overflow-hidden z-10 ${portraitMode ? 'p-1 sm:p-5 md:p-8' : ''}`}>
              <div className="absolute inset-0 bg-black/60 -z-10" />
              <div 
                className={`w-full h-full relative transition-[max-width,max-height,border-radius] duration-500 ${
                  portraitMode 
                    ? 'max-w-md max-h-[82vh] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-4 border-neutral-900 bg-black' 
                    : 'max-w-full h-full bg-black'
                }`}
              >
                {/* Physical game chassis bezel indicator */}
                {portraitMode && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black/40 rounded-full flex items-center justify-center gap-1 z-50">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[5.5px] text-gray-500 uppercase tracking-widest font-extrabold scale-90">POWER</span>
                  </div>
                )}
                
                <iframe 
                  src={activeGame.url}
                  className="w-full h-full border-none bg-black"
                  allow="autoplay; fullscreen; gamepad; focus"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-downloads"
                  title={activeGame.name}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
