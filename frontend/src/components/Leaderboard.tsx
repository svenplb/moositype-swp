import { useEffect, useState } from "react";
import { getLeaderboard } from "../services/api";

interface LeaderboardEntry {
  username: string;
  wpm: number;
  accuracy: number;
  wordCount: number;
  timestamp: string;
}

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedWordCount, setSelectedWordCount] = useState<number>(25);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  const filteredLeaderboard = leaderboard
    .filter((entry) => entry.wordCount === selectedWordCount)
    .slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-mono">
      <h2 className="text-2xl font-bold mb-8 text-text">Global Leaderboard</h2>

      <div className="flex gap-4 mb-8">
        {[25, 50, 100].map((count) => (
          <button
            key={count}
            onClick={() => setSelectedWordCount(count)}
            className={`word-count-btn ${
              selectedWordCount === count
                ? "bg-secondary text-text"
                : "text-text-darker"
            }`}
          >
            {count}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-4 p-4 bg-secondary rounded-lg text-text font-semibold">
          <div>Rank</div>
          <div>Username</div>
          <div>WPM</div>
          <div>Accuracy</div>
        </div>

        {filteredLeaderboard.map((entry, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-4 p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors"
          >
            <div className="text-accent">#{index + 1}</div>
            <div>{entry.username}</div>
            <div className="text-accent">{entry.wpm} wpm</div>
            <div>{entry.accuracy}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};
