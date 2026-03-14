import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, ChevronLeft, ChevronUp, ChevronDown, CheckCircle, Target, Crosshair, Star } from 'lucide-react';

// --- SNAKE GAME ---
export function SnakeGame({ onExit, onScore }) {
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState([0, 0]); // Initially stopped
  const [gameOver, setGameOver] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [started, setStarted] = useState(false);
  const gridRef = useRef(null);

  const keyToDirection = {
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1],
    w: [-1, 0],
    s: [1, 0],
    a: [0, -1],
    d: [0, 1],
    W: [-1, 0],
    S: [1, 0],
    A: [0, -1],
    D: [0, 1]
  };

  const handleKeyDown = useCallback((e) => {
    if (gameOver) return;
    const newDir = keyToDirection[e.key];
    if (newDir) {
      e.preventDefault();
      setStarted(true);
      setDirection(prev => {
        // Prevent reversing directly
        if (prev[0] !== 0 && newDir[0] === -prev[0]) return prev;
        if (prev[1] !== 0 && newDir[1] === -prev[1]) return prev;
        return newDir;
      });
    }
  }, [gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gridRef.current) gridRef.current.focus();
  }, []);

  useEffect(() => {
    if (gameOver || !started) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const newHead = [prev[0][0] + direction[0], prev[0][1] + direction[1]];
        // Hit walls
        if (newHead[0] < 0 || newHead[0] >= 20 || newHead[1] < 0 || newHead[1] >= 20 || prev.some(s => s[0] === newHead[0] && s[1] === newHead[1])) {
          setGameOver(true);
          return prev;
        }
        const newSnake = [newHead, ...prev];
        // Eat food
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setCurrentScore(s => s + 10);
          setFood([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 100); // slightly faster
    return () => clearInterval(interval);
  }, [direction, food, gameOver, started]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#07090c]/95 backdrop-blur-3xl animate-in zoom-in duration-500 px-6">
      <div className="glass-card max-w-2xl w-full p-12 rounded-[4rem] border-white/10 relative overflow-hidden bg-gradient-to-br from-indigo-900/10 to-transparent flex flex-col items-center select-none"
           tabIndex="0" ref={gridRef}>
        
        <div className="flex w-full items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
              <span className="text-red-500">ðŸ  </span> SNAKE
            </h2>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Score</p>
             <p className="text-3xl font-black text-red-400 tracking-tighter">{currentScore}</p>
          </div>
        </div>

        <div className="aspect-square w-[350px] bg-black/60 rounded-[1rem] border border-white/10 relative mb-8 grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))] p-2 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
           {gameOver ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10 rounded-xl">
                <h3 className="text-3xl font-black uppercase italic mb-2 text-red-500">GAME OVER</h3>
                <p className="text-white/60 font-bold mb-6">Score: {currentScore}</p>
                <div className="flex gap-4">
                   <button onClick={() => { setSnake([[10, 10]]); setDirection([0,0]); setStarted(false); setGameOver(false); setCurrentScore(0); gridRef.current?.focus(); }} className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-black uppercase text-xs transition-colors">Restart</button>
                   <button onClick={() => { onScore(currentScore); onExit(); }} className="px-6 py-3 glass hover:bg-white/10 rounded-xl font-black uppercase text-xs border-white/10 transition-colors">Exit</button>
                </div>
             </div>
           ) : !started ? (
             <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 rounded-xl">
                 <p className="font-bold text-white/50 text-sm animate-pulse tracking-widest uppercase">Press Arrow Keys To Start</p>
             </div>
           ) : null}
           
           {!gameOver && (
             <>
               {snake.map((s, i) => (
                 <div key={i} style={{ gridColumnStart: s[1] + 1, gridRowStart: s[0] + 1 }} className={`w-full h-full rounded-sm ${i === 0 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] z-10 scale-110' : 'bg-red-500/60'}`}></div>
               ))}
               <div style={{ gridColumnStart: food[1] + 1, gridRowStart: food[0] + 1 }} className="w-full h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse scale-75"></div>
             </>
           )}
        </div>

        <div className="grid grid-cols-3 gap-2 w-32">
           <div />
           <button onClick={() => { setDirection([-1, 0]); setStarted(true); gridRef.current?.focus(); }} className="h-10 glass rounded-lg flex items-center justify-center hover:bg-white/10 active:bg-white/20"><ChevronUp size={20} /></button>
           <div />
           <button onClick={() => { setDirection([0, -1]); setStarted(true); gridRef.current?.focus(); }} className="h-10 glass rounded-lg flex items-center justify-center hover:bg-white/10 active:bg-white/20"><ChevronLeft size={20} /></button>
           <button onClick={() => { setDirection([1, 0]); setStarted(true); gridRef.current?.focus(); }} className="h-10 glass rounded-lg flex items-center justify-center hover:bg-white/10 active:bg-white/20"><ChevronDown size={20} /></button>
           <button onClick={() => { setDirection([0, 1]); setStarted(true); gridRef.current?.focus(); }} className="h-10 glass rounded-lg flex items-center justify-center hover:bg-white/10 active:bg-white/20"><ChevronRight size={20} /></button>
        </div>
        
        <button onClick={() => { onScore(currentScore); onExit(); }} className="absolute top-6 right-6 text-white/30 hover:text-white font-bold text-xs tracking-widest uppercase">Close</button>
      </div>
    </div>
  )
}

// --- TETRIS GAME ---
const TETROMINOS = {
  0: { shape: [[0]], color: 'bg-transparent' },
  I: { shape: [[0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0]], color: 'bg-cyan-500' },
  J: { shape: [[0, 'J', 0], [0, 'J', 0], ['J', 'J', 0]], color: 'bg-blue-500' },
  L: { shape: [[0, 'L', 0], [0, 'L', 0], [0, 'L', 'L']], color: 'bg-orange-500' },
  O: { shape: [['O', 'O'], ['O', 'O']], color: 'bg-yellow-400' },
  S: { shape: [[0, 'S', 'S'], ['S', 'S', 0], [0, 0, 0]], color: 'bg-green-500' },
  T: { shape: [[0, 0, 0], ['T', 'T', 'T'], [0, 'T', 0]], color: 'bg-purple-500' },
  Z: { shape: [['Z', 'Z', 0], [0, 'Z', 'Z'], [0, 0, 0]], color: 'bg-red-500' }
};

const randomTetromino = () => {
  const tetrominos = 'IJLOSTZ';
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};

const STAGE_WIDTH = 10;
const STAGE_HEIGHT = 20;

export function TetrisGame({ onExit, onScore }) {
  const [stage, setStage] = useState(Array.from(Array(STAGE_HEIGHT), () => new Array(STAGE_WIDTH).fill([0, 'clear'])));
  const [player, setPlayer] = useState({ pos: { x: 0, y: 0 }, tetromino: TETROMINOS[0].shape, collided: false });
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gridRef = useRef(null);

  const startGame = () => {
    setStage(Array.from(Array(STAGE_HEIGHT), () => new Array(STAGE_WIDTH).fill([0, 'clear'])));
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    setScore(0);
    gridRef.current?.focus();
  };

  const updatePlayerPos = ({ x, y, collided }) => {
    setPlayer(prev => ({
      ...prev,
      pos: { x: (prev.pos.x + x), y: (prev.pos.y + y) },
      collided,
    }));
  };

  const resetPlayer = useCallback(() => {
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: randomTetromino().shape,
      collided: false,
    });
  }, []);

  const checkCollision = (player, stage, { x: moveX, y: moveY }) => {
    for (let y = 0; y < player.tetromino.length; y += 1) {
      for (let x = 0; x < player.tetromino[y].length; x += 1) {
        if (player.tetromino[y][x] !== 0) {
          if (
            !stage[y + player.pos.y + moveY] ||
            !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
            stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const sweepRows = newStage => {
    return newStage.reduce((ack, row) => {
      if (row.findIndex(cell => cell[0] === 0) === -1) {
        setScore(prev => prev + 100);
        ack.unshift(new Array(STAGE_WIDTH).fill([0, 'clear']));
        return ack;
      }
      ack.push(row);
      return ack;
    }, []);
  };

  useEffect(() => {
    if (gameOver) return;
    const updateStage = prevStage => {
      // Flush the stage
      const newStage = prevStage.map(row => row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)));
      // Draw the tetromino
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newStage[y + player.pos.y][x + player.pos.x] = [value, `${player.collided ? 'merged' : 'clear'}`];
          }
        });
      });
      if (player.collided) {
        resetPlayer();
        return sweepRows(newStage);
      }
      return newStage;
    };
    if (player.tetromino[0][0] !== 0 || player.tetromino.length > 1) {
       setStage(prev => updateStage(prev));
    }
  }, [player, resetPlayer, gameOver]);

  const drop = () => {
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  useEffect(() => {
    if (!dropTime || gameOver) return;
    const interval = setInterval(() => drop(), dropTime);
    return () => clearInterval(interval);
  }, [dropTime, drop, gameOver]);

  const movePlayer = dir => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  };

  const rotate = (matrix, dir) => {
    const rotatedTetro = matrix.map((_, index) => matrix.map(col => col[index]));
    if (dir > 0) return rotatedTetro.map(row => row.reverse());
    return rotatedTetro.reverse();
  };

  const playerRotate = (stage, dir) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);
    
    // Check wall kicks simply by shifting x if needed
    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        // rotation failed
        rotate(clonedPlayer.tetromino, -dir);
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
  };

  const move = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 37) movePlayer(-1);
      else if (keyCode === 39) movePlayer(1);
      else if (keyCode === 40) drop();
      else if (keyCode === 38) playerRotate(stage, 1);
    }
  };

  useEffect(() => {
    if (gridRef.current) gridRef.current.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#07090c]/95 backdrop-blur-3xl animate-in zoom-in duration-500 px-6">
      <div className="glass-card max-w-2xl w-full p-10 rounded-[3rem] border-white/10 relative bg-gradient-to-br from-blue-900/10 to-transparent flex outline-none"
           tabIndex="0" onKeyDown={move} ref={gridRef}>
        
        {/* Play Area */}
        <div className="flex-1 flex justify-center items-center">
            <div className="w-[200px] h-[400px] bg-[#111] grid grid-rows-20 grid-cols-10 gap-0.5 border-2 border-white/10 p-0.5 relative rounded-lg overflow-hidden">
                {gameOver && (
                  <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
                    <p className="font-black text-2xl text-red-500 mb-2">GAME OVER</p>
                    <button onClick={startGame} className="bg-indigo-600 px-6 py-2 rounded-lg font-bold text-sm text-white mt-4 hover:bg-indigo-500">Restart</button>
                  </div>
                )}
                {!dropTime && !gameOver && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                    <button onClick={startGame} className="bg-indigo-600 px-6 py-3 rounded-xl font-bold text-white shadow-lg animate-pulse">Start Tetris</button>
                  </div>
                )}
                {stage.map(row => row.map((cell, x) => (
                    <div key={Math.random()} className={`w-full h-full rounded-sm ${cell[0] === 0 ? 'bg-white/5' : TETROMINOS[cell[0]].color}`}></div>
                )))}
            </div>
        </div>

        {/* Sidebar */}
        <div className="w-1/3 flex flex-col items-center justify-between py-10">
          <div className="text-center w-full">
             <h2 className="text-4xl font-black uppercase italic text-blue-400 tracking-tighter mb-4">TETRIS</h2>
             <div className="glass p-4 rounded-xl border-white/10 w-full mb-4 text-center">
               <p className="text-[10px] uppercase text-white/50 tracking-widest font-bold mb-1">Score</p>
               <p className="text-3xl font-black text-white">{score}</p>
             </div>
             <p className="text-[10px] text-white/30 tracking-widest leading-loose mt-4 uppercase">Up: Rotate<br/>Left/Right: Move<br/>Down: Drop</p>
          </div>
          <button onClick={() => { onScore(score); onExit(); }} className="px-6 py-3 glass hover:bg-white/10 rounded-xl font-black uppercase text-xs border-white/10 transition-colors w-full">Exit Game</button>
        </div>

      </div>
    </div>
  )
}

// --- SPACESHIP BLASTER ---
export function SpaceBlasterGame({ onExit, onScore }) {
    const [score, setScore] = useState(0);
    const [player, setPlayer] = useState({ x: 50 }); // percentage
    const [lasers, setLasers] = useState([]);
    const [enemies, setEnemies] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [started, setStarted] = useState(false);
    const gameAreaRef = useRef(null);

    const startGame = () => {
        setScore(0);
        setPlayer({ x: 50 });
        setLasers([]);
        setEnemies([]);
        setGameOver(false);
        setStarted(true);
        setTimeout(() => gameAreaRef.current?.focus(), 100);
    };

    // Enemy spawner
    useEffect(() => {
        if (!started || gameOver) return;
        const interval = setInterval(() => {
            setEnemies(prev => {
                if (prev.length > 8) return prev; // max 8 enemies
                return [...prev, { id: Date.now(), x: Math.random() * 90, y: -10 }];
            });
        }, 1500);
        return () => clearInterval(interval);
    }, [started, gameOver]);

    // Game loop (movement & collision)
    useEffect(() => {
        if (!started || gameOver) return;
        const loop = setInterval(() => {
            // Move lasers up
            setLasers(prev => prev.map(l => ({...l, y: l.y - 4})).filter(l => l.y > -10));
            // Move enemies down
            setEnemies(prev => {
                const updated = prev.map(e => ({...e, y: e.y + 0.5}));
                // Check if enemy hit bottom (game over condition or health loss)
                if (updated.some(e => e.y > 100)) setGameOver(true);
                return updated;
            });

            // Collision check
            setLasers(ls => {
                let currentLasers = [...ls];
                setEnemies(es => {
                    let newEnemies = [...es];
                    currentLasers.forEach((l, lIdx) => {
                        newEnemies.forEach((e, eIdx) => {
                            if (Math.abs(l.x - e.x) < 8 && Math.abs(l.y - e.y) < 8) {
                                // Hit
                                currentLasers[lIdx].dead = true;
                                newEnemies[eIdx].dead = true;
                                setScore(s => s + 50);
                            }
                        });
                    });
                    return newEnemies.filter(e => !e.dead);
                });
                return currentLasers.filter(l => !l.dead);
            });
        }, 30);
        return () => clearInterval(loop);
    }, [started, gameOver]);

    const handleKeyDown = (e) => {
        if (!started || gameOver) return;
        if (e.key === 'ArrowLeft') setPlayer(p => ({ x: Math.max(5, p.x - 5) }));
        if (e.key === 'ArrowRight') setPlayer(p => ({ x: Math.min(95, p.x + 5) }));
        if (e.key === ' ' || e.key === 'ArrowUp') {
            e.preventDefault();
            setLasers(prev => [...prev, { id: Date.now(), x: player.x, y: 85 }]);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#07090c]/95 backdrop-blur-3xl animate-in zoom-in duration-500 px-6">
            <div className="glass-card max-w-3xl w-full p-8 rounded-[3rem] border-white/10 relative bg-gradient-to-br from-indigo-900/10 to-transparent shadow-[0_0_50px_rgba(30,27,75,0.5)]">
               
               <div className="flex justify-between items-center mb-6">
                   <div>
                       <h2 className="text-3xl font-black uppercase tracking-tighter text-cyan-400 italic">NEON BLASTER</h2>
                       <p className="text-[10px] text-white/50 uppercase tracking-widest">Defend the grid</p>
                   </div>
                   <div className="text-right">
                       <p className="text-2xl font-black text-white">{score}</p>
                       <p className="text-[10px] uppercase text-white/40 tracking-widest">ScorePts</p>
                   </div>
               </div>

               <div className="w-full h-[450px] bg-[#050510] border-2 border-indigo-500/30 rounded-2xl relative overflow-hidden focus:outline-none focus:border-cyan-400/50 transition-colors"
                    tabIndex="0" onKeyDown={handleKeyDown} ref={gameAreaRef}>
                   
                   {/* Starfield bg */}
                   <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 130px 80px, #ffffff, rgba(0,0,0,0))', backgroundRepeat: 'repeat', backgroundSize: '200px 200px'}}></div>

                   {!started && !gameOver && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/50">
                           <Crosshair size={48} className="text-cyan-400 mb-6 animate-pulse" />
                           <button onClick={startGame} className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)]">Start Engine</button>
                           <p className="mt-6 text-[10px] text-white/50 font-black tracking-widest uppercase">Left / Right to move Â· Space to fire</p>
                       </div>
                   )}

                   {gameOver && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/80">
                           <h2 className="text-4xl font-black text-red-500 italic mb-2 tracking-tighter">HULL BREACHED</h2>
                           <p className="text-white/70 font-bold mb-8">Score Achieved: {score}</p>
                           <button onClick={startGame} className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)]">Re-deploy</button>
                       </div>
                   )}

                   {/* Player */}
                   {started && !gameOver && (
                       <div className="absolute bottom-[10%] w-8 h-8 -translate-x-1/2 transition-all duration-75" style={{left: `${player.x}%`}}>
                           <div className="w-full h-full text-cyan-400">
                               <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5H5.5L12 6.5z"/></svg>
                           </div>
                           <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2 h-4 bg-orange-500 blur-sm rounded-full animate-pulse"></div>
                       </div>
                   )}

                   {/* Lasers */}
                   {lasers.map(l => (
                       <div key={l.id} className="absolute w-1 h-6 bg-cyan-300 rounded-full shadow-[0_0_8px_rgba(103,232,249,1)] -translate-x-1/2" style={{left: `${l.x}%`, top: `${l.y}%`}}></div>
                   ))}

                   {/* Enemies */}
                   {enemies.map(e => (
                       <div key={e.id} className="absolute w-8 h-8 text-fuchsia-500 -translate-x-1/2 -translate-y-1/2" style={{left: `${e.x}%`, top: `${e.y}%`}}>
                           <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm-2 0c0-4.418-3.582-8-8-8s-8 3.582-8 8 3.582 8 8 8 8-3.582 8-8zm-9-4h2v6h-2V8zm0 8h2v2h-2v-2z"/></svg>
                       </div>
                   ))}
               </div>

               <div className="mt-6 flex justify-between">
                   <p className="text-[10px] text-white/30 uppercase tracking-widest font-black flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>System Active</p>
                   <button onClick={() => { onScore(score); onExit(); }} className="px-6 py-2 glass hover:bg-white/10 rounded-lg text-[10px] font-black tracking-widest text-white/50 uppercase transition-all">Close Instance</button>
               </div>
            </div>
        </div>
    )
}

// --- TICTACTOE GAME ---
export function TicTacToe({ onExit, onScore }) {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState(null);

    const checkWinner = (squares) => {
        const lines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
        }
        return null;
    };

    const handleClick = (i) => {
        if (winner || board[i]) return;
        const newBoard = [...board];
        newBoard[i] = xIsNext ? 'X' : 'O';
        setBoard(newBoard);
        setXIsNext(!xIsNext);
        const win = checkWinner(newBoard);
        if (win) {
            setWinner(win);
            onScore(100); // Give 100 points to the identity on any win
        } else if (!newBoard.includes(null)) {
            setWinner('Draw');
            onScore(20);
        }
    };

    const reset = () => {
        setBoard(Array(9).fill(null));
        setWinner(null);
        setXIsNext(true);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#07090c]/95 backdrop-blur-3xl animate-in zoom-in duration-500 px-6">
            <div className="glass-card max-w-lg w-full p-10 rounded-[4rem] border-white/10 relative overflow-hidden bg-gradient-to-br from-purple-900/10 to-transparent flex flex-col items-center shadow-[0_0_60px_rgba(168,85,247,0.1)]">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">NEVER <span className="text-purple-400">SETTLE</span></h2>
                <div className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-8 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">Player {xIsNext ? 'X' : 'O'} Turn</div>

                <div className="w-[300px] h-[300px] grid grid-cols-3 grid-rows-3 gap-2 bg-white/5 p-2 rounded-2xl mb-8 relative">
                    {winner && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 rounded-2xl backdrop-blur-sm animate-in fade-in">
                            <h3 className="text-4xl font-black uppercase text-purple-400 italic bg-clip-text mb-4">
                                {winner === 'Draw' ? 'DRAW!' : `${winner} WINS!`}
                            </h3>
                            <button onClick={reset} className="px-6 py-2 border border-purple-500/50 bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white rounded-lg font-black uppercase text-xs tracking-widest transition-colors mb-2">Rematch</button>
                            <p className="text-[9px] uppercase tracking-widest font-black text-white/30">+ Points Synced</p>
                        </div>
                    )}
                    {board.map((cell, idx) => (
                        <div key={idx} onClick={() => handleClick(idx)} 
                             className="bg-[#0a0c0f] rounded-xl flex items-center justify-center text-5xl font-black cursor-pointer hover:bg-[#12141a] transition-colors shadow-inner border border-white/5 select-none"
                             style={{ color: cell === 'X' ? '#a855f7' : cell === 'O' ? '#06b6d4' : 'transparent' }}>
                            {cell}
                        </div>
                    ))}
                </div>

                <button onClick={() => { onExit(); }} className="px-8 py-3 glass hover:bg-white/10 rounded-xl font-black uppercase text-xs border-white/10 transition-colors tracking-widest text-white/50">Surrender & Exit</button>
            </div>
        </div>
    )
}
