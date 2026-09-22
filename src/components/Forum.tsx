import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Trash2, Send, Loader2, Gamepad2, Users, Cpu, Radio } from 'lucide-react';
import { auth, db, handleFirestoreError, signInWithGoogle, OperationType } from '../firebase';
import { collection, onSnapshot, query, where, orderBy, setDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

interface Post {
  id: string;
  userId: string;
  authorName: string;
  content: string;
  type: 'comment' | 'request';
  visibility: 'public';
  createdAt: any;
}

interface ForumProps {
  theme?: 'neon' | 'classic' | 'dark';
  displayName?: string;
}

export function Forum({ theme = 'neon', displayName = 'PLAYER_1' }: ForumProps) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'comment' | 'request'>('comment');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Colors based on console settings
  const colorMap = {
    neon: {
      accent: 'text-cyan-400',
      border: 'border-cyan-500/30',
      ring: 'focus:border-cyan-400 focus:ring-cyan-500/20',
      bgGlow: 'shadow-[0_0_20px_rgba(34,211,238,0.15)]',
      accentBg: 'bg-cyan-500/10',
      badge: 'bg-cyan-500/20 text-cyan-300',
      postBorder: 'border-cyan-500/20 hover:border-cyan-400/40',
      tag: 'border-cyan-500/40 bg-cyan-950/40 text-cyan-400',
    },
    classic: {
      accent: 'text-amber-400',
      border: 'border-amber-500/30',
      ring: 'focus:border-amber-400 focus:ring-amber-500/20',
      bgGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
      accentBg: 'bg-amber-500/10',
      badge: 'bg-amber-500/20 text-amber-300',
      postBorder: 'border-amber-500/20 hover:border-amber-400/40',
      tag: 'border-amber-500/40 bg-amber-950/40 text-amber-400',
    },
    dark: {
      accent: 'text-neutral-200',
      border: 'border-white/10',
      ring: 'focus:border-white focus:ring-white/10',
      bgGlow: 'shadow-[0_0_20px_rgba(255,255,255,0.05)]',
      accentBg: 'bg-white/15',
      badge: 'bg-white/10 text-white',
      postBorder: 'border-white/10 hover:border-white/20',
      tag: 'border-white/25 bg-white/5 text-neutral-300',
    }
  };

  const style = colorMap[theme] || colorMap.neon;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      where('visibility', '==', 'public'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(pData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'posts');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPostContent.trim()) return;
    
    setIsSubmitting(true);
    const newDocRef = doc(collection(db, 'posts'));
    
    try {
      await setDoc(newDocRef, {
        userId: user.uid,
        authorName: user.displayName || displayName || 'Anonymous Player',
        content: newPostContent.trim(),
        type: newPostType,
        visibility: 'public',
        createdAt: serverTimestamp()
      });
      setNewPostContent('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `posts/${postId}`);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto mt-8 bg-black/75 backdrop-blur-2xl border-2 ${style.border} ${style.bgGlow} rounded-2xl p-5 md:p-7 relative overflow-hidden font-mono`}>
      {/* Visual background scanning ribbon */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20 mix-blend-overlay"></div>
      
      {/* Sub Header Specs Bar */}
      <div className="absolute top-0 inset-x-0 h-[22px] border-b border-white/5 bg-white/[0.02] flex items-center justify-between px-4 text-[9px] text-gray-500 tracking-wider select-none z-10">
        <div className="flex items-center gap-1.5">
          <Radio className={`w-3 h-3 ${style.accent} animate-pulse`} />
          <span>NET_ACCESS: LINKED</span>
        </div>
        <div className="flex gap-2.5">
          <span>PORT: BBS // CHANNEL_01</span>
          <span>REVISION: V3.41</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-3 mb-6 gap-3 pt-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-1.5 h-6 bg-current ${style.accent}`} />
          <div className="space-y-[1px]">
            <h2 className="text-sm md:text-md uppercase font-black text-white tracking-[0.25em]">
              Community Transmitter
            </h2>
            <p className="text-[10px] text-gray-400 tracking-wider">SECURE CONSOLE BBS BULLETIN BOARD DIRECTORY</p>
          </div>
        </div>
        
        {!user ? (
          <button 
            onClick={signInWithGoogle}
            className={`px-5 py-2 bg-white/5 border border-white/10 hover:border-white/30 text-white rounded font-bold uppercase transition-all text-[11px] tracking-widest backdrop-blur-md cursor-pointer`}
          >
            Google Authorized Sign-In
          </button>
        ) : (
          <div className="flex items-center gap-2 border border-white/5 bg-white/[0.02] px-3.5 py-1.5 rounded-sm">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-[11px] font-bold tracking-widest uppercase">
              ONLINE: {user.displayName || displayName}
            </span>
          </div>
        )}
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="mb-8 bg-black/60 border border-white/5 hover:border-white/10 shadow-inner rounded-lg p-3 sm:p-4">
          <div className="flex space-x-2 mb-3.5">
            <button
              type="button"
              onClick={() => setNewPostType('comment')}
              className={`px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all ${newPostType === 'comment' ? `${style.badge} border border-current shadow-[0_0_10px_rgba(255,255,255,0.05)]` : 'bg-black/40 border border-white/10 text-gray-400 hover:text-white'}`}
            >
              General Transmission
            </button>
            <button
              type="button"
              onClick={() => setNewPostType('request')}
              className={`flex flex-row items-center gap-1 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all ${newPostType === 'request' ? `${style.badge} border border-current shadow-[0_0_10px_rgba(255,255,255,0.05)]` : 'bg-black/40 border border-white/10 text-gray-400 hover:text-white'}`}
            >
              <Gamepad2 className="w-3.5 h-3.5"/> Game ROM Request
            </button>
          </div>
          
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder={newPostType === 'comment' ? "Broadcasting signal to community players..." : "Enter requested console title, rom ID, or system suggestion..."}
            className={`w-full bg-black/85 border border-white/10 focus:border-white/30 rounded p-3 text-white placeholder-white/20 min-h-[90px] text-xs outline-none focus:ring-0 transition-all resize-y font-mono`}
            maxLength={1000}
            required
          />
          
          <div className="flex justify-end mt-2">
            <button 
              type="submit" 
              disabled={isSubmitting || !newPostContent.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-sm disabled:opacity-50 transition-all uppercase text-[10px] tracking-widest cursor-pointer shadow-md"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Send signal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center p-10 bg-black/50 border border-white/5 rounded text-gray-500 text-xs tracking-wider">
          --- TRANMISION_STABLE: NO BULLETIN BOARD DISPATCHES ---
        </div>
      ) : (
        <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
          {posts.map(post => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded border ${post.type === 'request' ? style.tag : 'bg-black/40 border-white/5 hover:border-white/10'} relative group transition-all duration-200`}
            >
              <div className="flex justify-between items-center mb-1.5 border-b border-white/5 pb-1">
                <div className="flex items-center gap-2">
                  <div className={`text-[8px] font-black uppercase px-2 py-[2px] rounded-sm ${post.type === 'request' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' : 'bg-white/10 text-gray-300'}`}>
                    {post.type}
                  </div>
                  <span className="font-bold text-gray-200 text-xs tracking-wider uppercase">{post.authorName}</span>
                </div>
                
                {user && user.uid === post.userId && (
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-all"
                    title="Delete post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-gray-350 whitespace-pre-wrap font-sans text-xs font-normal leading-relaxed">{post.content}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
