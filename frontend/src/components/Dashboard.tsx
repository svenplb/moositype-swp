import { useEffect, useState } from "react";
import { getTestResults } from "../services/api";

interface TestResult {
  wpm: number;
  cpm: number;
  accuracy: number;
  wordCount: number;
  timestamp: string;
}

interface BestResults {
  25: TestResult | null;
  50: TestResult | null;
  100: TestResult | null;
}

export const Dashboard = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [bestResults, setBestResults] = useState<BestResults>({
    25: null,
    50: null,
    100: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getTestResults();
        setResults(data);

        // Calculate best results for each word count
        const best: BestResults = {
          25: null,
          50: null,
          100: null,
        };

        data.forEach((result) => {
          const category = result.wordCount as keyof BestResults;
          if (!best[category] || result.wpm > best[category]!.wpm) {
            best[category] = result;
          }
        });

        setBestResults(best);
      } catch (err) {
        setError("Failed to load test results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen font-mono">
        Loading...
      </div>
    );

  if (error)
    return <div className="text-red-500 font-mono text-center">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-mono">
      <h2 className="text-2xl font-bold mb-8 text-text">Personal Bests</h2>
      <div className="grid grid-cols-3 gap-4 mb-12">
        {[25, 50, 100].map((wordCount) => (
          <div key={wordCount} className="bg-secondary/30 p-4 rounded-lg">
            <div className="text-text-darker mb-2">{wordCount} words</div>
            {bestResults[wordCount as keyof BestResults] ? (
              <>
                <div className="text-2xl text-accent mb-1">
                  {bestResults[wordCount as keyof BestResults]!.wpm} wpm
                </div>
                <div className="text-text-darker text-sm">
                  {bestResults[wordCount as keyof BestResults]!.accuracy}%
                  accuracy
                </div>
              </>
            ) : (
              <div className="text-text-darker">No attempts yet</div>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-8 text-text">Test History</h2>
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-4 p-4 bg-secondary rounded-lg text-text font-semibold">
          <div>WPM</div>
          <div>Accuracy</div>
          <div>Words</div>
          <div>Date</div>
        </div>
        {results.map((result, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-4 p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors"
          >
            <div className="text-accent">{result.wpm} wpm</div>
            <div>{result.accuracy}%</div>
            <div className="text-text-darker">{result.wordCount}</div>
            <div className="text-text-darker">
              {new Date(result.timestamp).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
