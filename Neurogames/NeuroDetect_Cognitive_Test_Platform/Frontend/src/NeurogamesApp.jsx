import React, { useState, useEffect } from "react";

// List of all games
const GAMES = [
  {
    key: "nback",
    name: "N-Back Game",
    description: "Test your working memory by identifying if the current letter matches the one N steps back.",
  },
  {
    key: "stroop",
    name: "Stroop Test",
    description: "Name the color of the word, not the word itself. Tests cognitive flexibility and attention.",
  },
  {
    key: "pal",
    name: "Paired Associate Learning (PAL) Test",
    description: "Memorize word pairs and recall them when prompted.",
  },
  {
    key: "toh",
    name: "Tower of Hanoi",
    description: "Solve the puzzle by moving disks between pegs, following the rules.",
  },
  {
    key: "tmt",
    name: "Trail Making Test",
    description: "Click scattered numbers in order as quickly as possible.",
  },
];

// Main App Component
export default function NeurogamesApp() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [results, setResults] = useState([]);
  const [showDashboard, setShowDashboard] = useState(true);

  function handleGameSelect(gameKey) {
    setSelectedGame(gameKey);
    setShowDashboard(false);
  }

  function handleGameEnd(gameResult) {
    setResults((prev) => [...prev, gameResult]);
    setSelectedGame(null);
    setShowDashboard(true);
  }

  function handleBackToDashboard() {
    setSelectedGame(null);
    setShowDashboard(true);
  }

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: "center" }}>Neurogames Cognitive Test Platform</h1>
      {showDashboard && (
        <Dashboard
          games={GAMES}
          results={results}
          onSelect={handleGameSelect}
        />
      )}

      {selectedGame === "nback" && (
        <NBackGame onEnd={handleGameEnd} onBack={handleBackToDashboard} />
      )}
      {selectedGame === "stroop" && (
        <StroopGame onEnd={handleGameEnd} onBack={handleBackToDashboard} />
      )}
      {selectedGame === "pal" && (
        <PALTest onEnd={handleGameEnd} onBack={handleBackToDashboard} />
      )}
      {selectedGame === "toh" && (
        <TowerOfHanoi onEnd={handleGameEnd} onBack={handleBackToDashboard} />
      )}
      {selectedGame === "tmt" && (
        <TrailMakingTest onEnd={handleGameEnd} onBack={handleBackToDashboard} />
      )}
    </div>
  );
}

// Dashboard showing games and results
function Dashboard({ games, results, onSelect }) {
  return (
    <div style={styles.dashboard}>
      <section>
        <h2>Available Games</h2>
        <ul style={styles.gameList}>
          {games.map((game) => (
            <li key={game.key} style={styles.gameCard}>
              <h3>{game.name}</h3>
              <p>{game.description}</p>
              <button onClick={() => onSelect(game.key)}>Play</button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Latest Results</h2>
        {results.length === 0 ? (
          <p>No games played yet.</p>
        ) : (
          <table style={styles.resultsTable}>
            <thead>
              <tr>
                <th>Game</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(-5).reverse().map((r, i) => (
                <tr key={i}>
                  <td>{GAMES.find((g) => g.key === r.gameKey)?.name || r.gameKey}</td>
                  <td>{r.score}</td>
                  <td>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

// === N-Back Game (Interactive, 2-back) ===
function NBackGame({ onEnd, onBack }) {
  const N = 2;
  const sequenceLength = 15;
  const [sequence, setSequence] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);

  // Generate random sequence when start
  function startGame() {
    const letters = "ABCDEFGHJKLMNPQRTUVWXYZ";
    let seq = Array.from({ length: sequenceLength }, () =>
      letters[Math.floor(Math.random() * letters.length)]
    );
    setSequence(seq);
    setCurrentIdx(0);
    setUserResponses([]);
    setScore(0);
    setStarted(true);
  }

  function handleResponse(isMatch) {
    if (currentIdx < N) return;
    const correct =
      sequence[currentIdx] === sequence[currentIdx - N] ? true : false;
    setUserResponses((prev) => [...prev, isMatch]);
    if (isMatch === correct) setScore((s) => s + 1);
    setCurrentIdx((idx) => idx + 1);
  }

  function handleFinish() {
    onEnd({
      gameKey: "nback",
      score: `${score} / ${sequenceLength - N}`,
      date: new Date().toLocaleString(),
    });
  }

  useEffect(() => {
    if (started && currentIdx >= sequenceLength) {
      handleFinish();
    }
    // eslint-disable-next-line
  }, [currentIdx]);

  return (
    <GameLayout title="N-Back Game (2-back)" onBack={onBack}>
      {!started ? (
        <>
          <p>In this 2-back task, press 'Match' if the current letter matches the one 2 steps back.</p>
          <button onClick={startGame}>Start</button>
        </>
      ) : currentIdx < sequenceLength ? (
        <>
          <div style={styles.nbackLetter}>{sequence[currentIdx]}</div>
          <div>
            <button
              onClick={() => handleResponse(true)}
              disabled={currentIdx < N}
              style={{ marginRight: 8 }}
            >
              Match
            </button>
            <button onClick={() => handleResponse(false)} disabled={currentIdx < N}>
              No Match
            </button>
          </div>
          <div>
            {currentIdx >= N
              ? `Is this a match with ${sequence[currentIdx - N]}?`
              : "Wait for more letters..."}
          </div>
          <div>
            Progress: {currentIdx + 1} / {sequenceLength}
          </div>
          <div>Score: {score}</div>
        </>
      ) : (
        <>
          <h3>Game Over!</h3>
          <div>
            Your Score: {score} / {sequenceLength - N}
          </div>
          <button onClick={onBack}>Back to Dashboard</button>
        </>
      )}
    </GameLayout>
  );
}

// === Stroop Test (Interactive) ===
function StroopGame({ onEnd, onBack }) {
  const COLORS = ["red", "blue", "green", "yellow", "purple"];
  const NUM_TRIALS = 12;
  const [trials, setTrials] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [reactionTimes, setReactionTimes] = useState([]);

  function startGame() {
    let arr = [];
    for (let i = 0; i < NUM_TRIALS; i++) {
      const word = COLORS[Math.floor(Math.random() * COLORS.length)];
      let color = COLORS[Math.floor(Math.random() * COLORS.length)];
      if (Math.random() < 0.4) color = word; // 40% congruent
      arr.push({ word, color });
    }
    setTrials(arr);
    setCurrent(0);
    setScore(0);
    setStarted(true);
    setStartTime(Date.now());
    setReactionTimes([]);
  }

  function handleColor(colorGuess) {
    if (!trials[current]) return;
    if (colorGuess === trials[current].color) setScore((s) => s + 1);
    setReactionTimes((rts) => [
      ...rts,
      Date.now() - startTime - rts.reduce((a, b) => a + b, 0)
    ]);
    setCurrent((c) => c + 1);
  }

  function handleFinish() {
    const avgRT =
      reactionTimes.length > 0
        ? (
            reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
          ).toFixed(0)
        : "-";
    onEnd({
      gameKey: "stroop",
      score: `${score} / ${NUM_TRIALS} (Avg RT: ${avgRT} ms)`,
      date: new Date().toLocaleString(),
    });
  }

  useEffect(() => {
    if (started && current >= NUM_TRIALS) {
      handleFinish();
    }
    // eslint-disable-next-line
  }, [current]);

  return (
    <GameLayout title="Stroop Test" onBack={onBack}>
      {!started ? (
        <>
          <p>
            For each word, click the <b>color of the letters</b>, not the word itself.{" "}
            <br /> Try to be fast and accurate!
          </p>
          <button onClick={startGame}>Start</button>
        </>
      ) : current < NUM_TRIALS ? (
        <>
          <div
            style={{
              ...styles.stroopWord,
              color: trials[current]?.color,
            }}
          >
            {trials[current]?.word?.toUpperCase()}
          </div>
          <div>
            {COLORS.map((c) => (
              <button
                style={{ ...styles.stroopBtn, backgroundColor: c, color: "#fff" }}
                key={c}
                onClick={() => handleColor(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div>
            Progress: {current + 1} / {NUM_TRIALS}
          </div>
          <div>Score: {score}</div>
        </>
      ) : (
        <>
          <h3>Test Complete!</h3>
          <div>
            Your Score: {score} / {NUM_TRIALS}<br />
            Avg Reaction Time:{" "}
            {reactionTimes.length > 0
              ? (
                  reactionTimes.reduce((a, b) => a + b, 0) /
                  reactionTimes.length
                ).toFixed(0)
              : "-"}{" "}
            ms
          </div>
          <button onClick={onBack}>Back to Dashboard</button>
        </>
      )}
    </GameLayout>
  );
}

// ==== PAL Test (Paired Associate Learning) ====
function PALTest({ onEnd, onBack }) {
  const pairs = [
    ["cat", "moon"],
    ["pen", "star"],
    ["cake", "tree"],
    ["book", "fish"],
    ["car", "shoe"],
    ["apple", "chair"],
  ];
  const NUM_PAIRS = 4;
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [shown, setShown] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);

  function startGame() {
    let shuffled = pairs.slice().sort(() => Math.random() - 0.5);
    let usePairs = shuffled.slice(0, NUM_PAIRS);
    setSelectedPairs(usePairs);
    setShown(true);
    setCurrentIdx(0);
    setScore(0);
    setInput("");
    setStarted(true);
  }

  function nextPhase() {
    setShown(false);
    setCurrentIdx(0);
    setInput("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (
      input.trim().toLowerCase() ===
      selectedPairs[currentIdx][1].toLowerCase()
    ) {
      setScore((s) => s + 1);
    }
    setInput("");
    setCurrentIdx((idx) => idx + 1);
  }

  function handleFinish() {
    onEnd({
      gameKey: "pal",
      score: `${score} / ${NUM_PAIRS}`,
      date: new Date().toLocaleString(),
    });
  }

  useEffect(() => {
    if (started && !shown && currentIdx >= NUM_PAIRS) {
      handleFinish();
    }
    // eslint-disable-next-line
  }, [currentIdx, shown]);

  return (
    <GameLayout title="Paired Associate Learning Test" onBack={onBack}>
      {!started ? (
        <>
          <p>
            You will see several word pairs. Try to remember them!<br />
            Then, you will be shown the first word and must recall its pair.
          </p>
          <button onClick={startGame}>Start</button>
        </>
      ) : shown ? (
        <>
          <h4>Memorize these pairs:</h4>
          <ul>
            {selectedPairs.map(([a, b], i) => (
              <li key={i} style={{ fontSize: "1.2em" }}>
                <b>{a}</b> - {b}
              </li>
            ))}
          </ul>
          <p>Ready?</p>
          <button onClick={nextPhase}>I'm Ready</button>
        </>
      ) : currentIdx < NUM_PAIRS ? (
        <>
          <form onSubmit={handleSubmit}>
            <p>
              What word was paired with <b>{selectedPairs[currentIdx][0]}</b>?
            </p>
            <input
              type="text"
              value={input}
              autoFocus
              onChange={(e) => setInput(e.target.value)}
              style={{ fontSize: "1.1em" }}
            />
            <button type="submit">Submit</button>
          </form>
          <div>
            Progress: {currentIdx + 1} / {NUM_PAIRS}
          </div>
          <div>Score: {score}</div>
        </>
      ) : (
        <>
          <h3>Test Complete!</h3>
          <div>
            Your Score: {score} / {NUM_PAIRS}
          </div>
          <button onClick={onBack}>Back to Dashboard</button>
        </>
      )}
    </GameLayout>
  );
}

// ==== Tower of Hanoi ====
function TowerOfHanoi({ onEnd, onBack }) {
  // 3 disks, 3 pegs
  const DISKS = 3;
  const PEGS = 3;
  const initial = Array.from({ length: DISKS }, (_, i) => DISKS - i);
  const [pegs, setPegs] = useState([initial, [], []]);
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState(0);

  function resetGame() {
    setPegs([initial, [], []]);
    setSelected(null);
    setMoves(0);
  }

  function handleSelect(fromIdx) {
    setSelected(fromIdx);
  }

  function handleMove(toIdx) {
    if (selected === null || selected === toIdx) return;
    let fromPeg = pegs[selected];
    let toPeg = pegs[toIdx];
    if (fromPeg.length === 0) return;
    const disk = fromPeg[fromPeg.length - 1];
    if (toPeg.length === 0 || disk < toPeg[toPeg.length - 1]) {
      let newPegs = pegs.map((peg) => [...peg]);
      newPegs[selected].pop();
      newPegs[toIdx].push(disk);
      setPegs(newPegs);
      setMoves((m) => m + 1);
      setSelected(null);
    }
  }

  useEffect(() => {
    if (
      pegs[2].length === DISKS &&
      pegs[0].length === 0 &&
      pegs[1].length === 0
    ) {
      setTimeout(() => {
        onEnd({
          gameKey: "toh",
          score: `${moves} moves`,
          date: new Date().toLocaleString(),
        });
      }, 500);
    }
    // eslint-disable-next-line
  }, [pegs]);

  return (
    <GameLayout title="Tower of Hanoi" onBack={onBack}>
      <p>
        Move all disks from the <b>leftmost peg</b> to the <b>rightmost peg</b>.
        <br />Only move one disk at a time, and never place a bigger disk on a smaller one.
      </p>
      <div style={styles.hanoiContainer}>
        {pegs.map((peg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.peg,
              border: selected === idx ? "2px solid #0074D9" : "2px solid #ccc"
            }}
            onClick={() =>
              selected === null ? handleSelect(idx) : handleMove(idx)
            }
          >
            <div style={styles.pegLabel}>Peg {idx + 1}</div>
            {peg
              .slice()
              .reverse()
              .map((disk, di) => (
                <div
                  key={di}
                  style={{
                    ...styles.disk,
                    width: `${60 + 30 * disk}px`,
                    background: `hsl(${disk * 60},70%,60%)`
                  }}
                >
                  {disk}
                </div>
              ))}
          </div>
        ))}
      </div>
      <div>Moves: {moves}</div>
      <button onClick={resetGame}>Reset</button>
    </GameLayout>
  );
}

// ==== Trail Making Test ====
function TrailMakingTest({ onEnd, onBack }) {
  const NUM_ITEMS = 12;
  function randomPositions() {
    let used = [];
    let arr = [];
    for (let i = 1; i <= NUM_ITEMS; i++) {
      let pos;
      do {
        pos = [
          Math.floor(Math.random() * 5),
          Math.floor(Math.random() * 4)
        ]; // 5x4 grid
      } while (used.some(([x, y]) => x === pos[0] && y === pos[1]));
      used.push(pos);
      arr.push({ num: i, pos });
    }
    return arr;
  }

  const [items, setItems] = useState([]);
  const [next, setNext] = useState(1);
  const [started, setStarted] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [times, setTimes] = useState([]);

  function startGame() {
    setItems(randomPositions());
    setNext(1);
    setStarted(true);
    setStartTimestamp(Date.now());
    setTimes([]);
  }

  function handleClick(num) {
    if (num === next) {
      setTimes((t) => [...t, Date.now()]);
      setNext((n) => n + 1);
    }
  }

  useEffect(() => {
    if (started && next > NUM_ITEMS) {
      const totalTime = (times[times.length - 1] - startTimestamp) / 1000;
      onEnd({
        gameKey: "tmt",
        score: `${totalTime.toFixed(2)} s`,
        date: new Date().toLocaleString(),
      });
    }
    // eslint-disable-next-line
  }, [next]);

  return (
    <GameLayout title="Trail Making Test" onBack={onBack}>
      {!started ? (
        <>
          <p>
            Click the numbers from 1 to {NUM_ITEMS} in order as fast as you can!
          </p>
          <button onClick={startGame}>Start</button>
        </>
      ) : (
        <div style={styles.tmtGrid}>
          {[...Array(5)].map((_, row) =>
            [...Array(4)].map((_, col) => {
              const item = items.find(
                (it) => it.pos[0] === row && it.pos[1] === col
              );
              return (
                <div key={row + "-" + col} style={styles.tmtCell}>
                  {item && item.num >= next ? (
                    <button
                      style={{
                        ...styles.tmtBtn,
                        background:
                          item.num === next ? "#0074D9" : "#aaa",
                        color: "#fff",
                        fontWeight: item.num === next ? "bold" : "normal"
                      }}
                      onClick={() => handleClick(item.num)}
                    >
                      {item.num}
                    </button>
                  ) : null}
                </div>
              );
            })
          )}
          <div style={{ gridColumn: "1 / span 4", marginTop: 16 }}>
            Progress: {next - 1} / {NUM_ITEMS}
          </div>
        </div>
      )}
    </GameLayout>
  );
}

// Layout for all games
function GameLayout({ title, children, onBack }) {
  return (
    <div style={styles.gameLayout}>
      <button onClick={onBack}>&larr; Back to Dashboard</button>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// Simple styles
const styles = {
  container: {
    maxWidth: 700,
    margin: "40px auto",
    padding: 24,
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 24px #0001",
  },
  dashboard: {
    marginBottom: 32,
  },
  gameList: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  gameCard: {
    border: "1px solid #eee",
    borderRadius: 8,
    padding: 16,
    boxShadow: "0 1px 4px #0001",
    background: "#fafbfc",
  },
  resultsTable: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    marginTop: 16,
  },
  gameLayout: {
    marginTop: 24,
    padding: 16,
    border: "1px solid #ddd",
    borderRadius: 8,
    background: "#f9f9f9",
  },
  nbackLetter: {
    fontSize: "3em",
    textAlign: "center",
    margin: "18px 0",
    fontWeight: "bold",
    letterSpacing: "0.15em",
  },
  stroopWord: {
    fontSize: "2.5em",
    margin: "18px 0",
    fontFamily: "Arial Black, Arial, sans-serif",
  },
  stroopBtn: {
    padding: "10px 22px",
    fontSize: "1.1em",
    margin: 4,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  hanoiContainer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "22px 0",
  },
  peg: {
    flex: 1,
    minHeight: 110,
    alignItems: "flex-end",
    display: "flex",
    flexDirection: "column-reverse",
    margin: "0 8px",
    border: "2px solid #ccc",
    borderRadius: 8,
    padding: "10px 0",
    background: "#f3f3fa",
    cursor: "pointer",
    position: "relative",
  },
  pegLabel: {
    position: "absolute",
    top: -20,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "0.9em",
    color: "#888",
  },
  disk: {
    height: 18,
    margin: "2px auto",
    borderRadius: 6,
    boxShadow: "0 2px 4px #0002",
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
  },
  tmtGrid: {
    display: "grid",
    gridTemplateRows: "repeat(5, 48px)",
    gridTemplateColumns: "repeat(4, 48px)",
    gap: 8,
    justifyContent: "center",
    padding: "18px 0",
  },
  tmtCell: {
    width: 48,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tmtBtn: {
    width: 44,
    height: 44,
    fontSize: "1.05em",
    borderRadius: 5,
    border: "none",
    cursor: "pointer",
  },
};
