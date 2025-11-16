import React, { useState, useRef, useEffect } from 'react';
import musicFile from './assets/god-trap-music-127261.mp3';

export default function OmCounter() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showTargetInput, setShowTargetInput] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let wakeLock = null;
    
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        console.log('Wake lock failed:', err);
      }
    };

    requestWakeLock();

    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, []);

  const increment = () => {
    if (target === 0) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2500);
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
      return;
    }

    const newCount = count + 1;
    setCount(newCount);

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    if (newCount === target) {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
      
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 300]);
      }

      setTimeout(() => {
        setCount(0);
      }, 2000);
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const reset = () => {
    setCount(0);
    setShowMessage(false);
    stopMusic();
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  const openTargetInput = () => {
    setShowTargetInput(true);
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const closeTargetInput = () => {
    setShowTargetInput(false);
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background Image - Using public folder */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('/image.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/60 to-black/80" />

      {/* Audio Element */}
      <audio ref={audioRef} src={musicFile} preload="auto" />

      {/* Main Container - Perfectly Centered */}
      <div className="relative z-10 w-full h-full max-w-2xl mx-auto flex flex-col p-4 sm:p-6 md:p-8">
        
        {/* Top Action Buttons - Proper Spacing */}
        <div className="w-full mb-6 sm:mb-8">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <button 
              onClick={reset} 
              className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-br from-slate-700/90 to-slate-800/90 hover:from-slate-600/90 hover:to-slate-700/90 backdrop-blur-xl text-white rounded-2xl sm:rounded-3xl transition-all font-bold text-sm sm:text-base shadow-2xl border-2 border-white/20 active:scale-95"
            >
              Reset
            </button>

            {isPlaying ? (
              <button 
                onClick={stopMusic} 
                className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-br from-red-600/90 to-red-700/90 hover:from-red-500/90 hover:to-red-600/90 backdrop-blur-xl text-white rounded-2xl sm:rounded-3xl transition-all font-bold text-sm sm:text-base shadow-2xl animate-pulse border-2 border-red-400/30 active:scale-95"
              >
                Stop
              </button>
            ) : (
              <div className="px-4 sm:px-6 py-3 sm:py-4" />
            )}

            <button 
              onClick={openTargetInput} 
              className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-br from-cyan-600/90 to-blue-700/90 hover:from-cyan-500/90 hover:to-blue-600/90 backdrop-blur-xl text-white rounded-2xl sm:rounded-3xl transition-all font-bold text-sm sm:text-base shadow-2xl border-2 border-cyan-400/30 active:scale-95"
            >
              Target
            </button>
          </div>
        </div>

        {/* Middle Content Area - Centered Vertically */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 sm:space-y-8">
          
          {/* App Title */}
          <div className="text-center">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black mb-2 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-pink-300 to-purple-300 drop-shadow-2xl">
                OM
              </span>
            </h1>
            <p className="text-white/70 text-xs sm:text-sm font-bold tracking-[0.5em] uppercase">
              Jappam Counter
            </p>
          </div>

          {/* Target Input Modal */}
          {showTargetInput && (
            <div className="w-full max-w-sm p-6 sm:p-8 bg-black/90 backdrop-blur-2xl border-2 border-white/40 rounded-3xl shadow-2xl">
              <label className="block text-xl sm:text-2xl font-black text-white mb-5 text-center">
                Set Your Target
              </label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full px-6 py-5 text-4xl sm:text-5xl bg-white/10 border-3 border-white/40 text-white rounded-2xl focus:border-white/80 focus:ring-4 focus:ring-white/30 focus:outline-none mb-5 text-center font-black placeholder-white/30"
                placeholder="108"
                min="0"
                inputMode="numeric"
              />
              <button
                onClick={closeTargetInput}
                className="w-full px-6 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl transition-all font-black text-xl shadow-2xl active:scale-95"
              >
                Confirm
              </button>
            </div>
          )}

          {/* Warning Message */}
          {showMessage && (
            <div className="w-full max-w-sm p-5 bg-yellow-400/95 backdrop-blur-sm border-3 border-yellow-300 text-black rounded-2xl text-center font-black text-lg shadow-2xl animate-bounce">
              ⚠️ Set a target first!
            </div>
          )}

          {/* Count Display Card */}
          <div className="w-full max-w-md">
            <div className="bg-black/70 backdrop-blur-2xl rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border-3 border-white/30">
              
              {/* Massive Count Number */}
              <div className="relative mb-8">
                <p className="text-8xl sm:text-9xl md:text-[12rem] font-black text-center leading-none">
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-200 to-purple-400 drop-shadow-2xl">
                    {count}
                  </span>
                </p>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-40 h-40 sm:w-56 sm:h-56 bg-purple-500/20 rounded-full blur-3xl" />
                </div>
              </div>

              {/* Target Display */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-white/60 text-base sm:text-lg font-bold uppercase tracking-wider">Target</span>
                <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-pink-300">
                  {target || '—'}
                </span>
              </div>

              {/* Progress Bar */}
              {target > 0 && (
                <div className="space-y-3">
                  <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden shadow-inner">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((count / target) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
                        boxShadow: '0 0 20px rgba(168, 85, 247, 0.8)'
                      }}
                    />
                  </div>
                  <p className="text-center text-base sm:text-lg text-white/80 font-black">
                    {Math.round((count / target) * 100)}% Complete
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom - Massive OM Button */}
        <div className="w-full mt-6 sm:mt-8">
          <button
            onClick={increment}
            className="w-full relative group active:scale-95 transition-transform duration-150"
            style={{ minHeight: '160px' }}
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-[2.5rem] blur-3xl opacity-75 group-active:opacity-100 transition-opacity" />
            <div className="relative w-full h-full px-10 py-12 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 rounded-[2.5rem] shadow-2xl border-4 border-white/40 flex items-center justify-center">
              <span className="text-7xl sm:text-8xl md:text-9xl font-black text-white drop-shadow-2xl">
                OM 🕉️
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}