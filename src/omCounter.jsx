import React, { useState, useRef, useEffect } from 'react';
import bgImage from './assets/image.png';
import musicFile from './assets/god-trap-music-127261.mp3';

export default function OmCounter() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showTargetInput, setShowTargetInput] = useState(false);
  const audioRef = useRef(null);

  // Prevent screen sleep and enable wake lock on mobile
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
      setTimeout(() => setShowMessage(false), 2000);
      return;
    }

    const newCount = count + 1;
    setCount(newCount);

    // Haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    if (newCount === target) {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
      
      // Stronger vibration on completion
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }

      setTimeout(() => {
        setCount(0);
      }, 1000);
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
  };

  const openTargetInput = () => {
    setShowTargetInput(true);
  };

  const closeTargetInput = () => {
    setShowTargetInput(false);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center"
      style={{ 
        backgroundImage: `url(${bgImage})`,
        touchAction: 'manipulation' // Prevent zoom on double tap
      }}
    >
      {/* Audio Element */}
      <audio ref={audioRef} src={musicFile} preload="auto" />

      {/* Main Content */}
      <div className="bg-white/85 backdrop-blur-md rounded-2xl shadow-2xl p-6 max-w-md w-full">
        {/* Top Buttons */}
        <div className="flex gap-2 mb-6">
          <button 
            onClick={reset} 
            className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 active:bg-gray-800 transition-colors font-semibold text-sm shadow-lg"
          >
            Reset
          </button>

          {isPlaying && (
            <button 
              onClick={stopMusic} 
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 active:bg-red-800 transition-colors font-semibold text-sm shadow-lg animate-pulse"
            >
              🔇 Stop
            </button>
          )}

          <button 
            onClick={openTargetInput} 
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors font-semibold text-sm shadow-lg"
          >
            Target
          </button>
        </div>

        <h1 className="text-5xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
          OM Counter
        </h1>

        {/* Target Input Modal */}
        {showTargetInput && (
          <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-400 rounded-2xl shadow-inner">
            <label className="block text-base font-bold text-gray-800 mb-3">
              🎯 Set Target Count
            </label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-full px-5 py-4 text-2xl border-3 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-200 focus:outline-none mb-4 text-center font-bold"
              placeholder="Enter target"
              min="0"
              inputMode="numeric"
            />
            <button
              onClick={closeTargetInput}
              className="w-full px-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all font-bold text-lg shadow-lg"
            >
              ✓ Done
            </button>
          </div>
        )}

        {/* Show Message */}
        {showMessage && (
          <div className="mb-5 p-4 bg-yellow-100 border-2 border-yellow-500 text-yellow-900 rounded-xl text-center font-semibold shadow-md animate-bounce">
            ⚠️ Please set a target value first!
          </div>
        )}

        {/* Count Display */}
        <div className="mb-8 text-center bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 shadow-inner">
          <p className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2">
            {count}
          </p>
          <div className="flex items-center justify-center gap-2 text-lg text-gray-700">
            <span className="font-medium">Target:</span>
            <span className="font-bold text-orange-600">
              {target || '❌ Not set'}
            </span>
          </div>
          {target > 0 && (
            <div className="mt-3 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((count / target) * 100, 100)}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Bottom OM Button */}
        <div className="flex justify-center">
          <button
            onClick={increment}
            className="w-full px-8 py-6 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:from-orange-600 hover:to-red-700 active:scale-95 transition-all font-black text-4xl shadow-2xl"
            style={{ touchAction: 'manipulation' }}
          >
            OM 🕉️
          </button>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="mt-6 text-center text-white text-sm font-medium drop-shadow-lg">
        <p>Tap OM button to count • Reach your target 🎯</p>
      </div>
    </div>
  );
}