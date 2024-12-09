import { useEffect, useState, useRef } from "react";
import { saveTestResult, getTestResults } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface TypingTestState {
  words: string[];
  correctCharactersTyped: number;
  charactersTyped: number;
  enteredWords: number;
  activeWordIndex: number;
  startTime: number | null;
  endTime: number | null;
  WPM: number | null;
  CPM: number | null;
  accuracy: number | null;
  wordCount: number;
  currentInput: string;
  bestWPM: number | null;
}

export const TypingTest = () => {
  const { isAuthenticated } = useAuth();

  const [state, setState] = useState<TypingTestState>({
    words: [],
    correctCharactersTyped: 0,
    charactersTyped: 0,
    enteredWords: 0,
    activeWordIndex: 0,
    startTime: null,
    endTime: null,
    WPM: null,
    CPM: null,
    accuracy: null,
    wordCount: 25,
    currentInput: "",
    bestWPM: null,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  const resetVariables = () => {
    setState((prev) => ({
      words: [],
      correctCharactersTyped: 0,
      charactersTyped: 0,
      enteredWords: 0,
      activeWordIndex: 0,
      startTime: null,
      endTime: null,
      WPM: null,
      CPM: null,
      accuracy: null,
      wordCount: prev.wordCount,
      currentInput: "",
      bestWPM: prev.bestWPM,
    }));
  };

  const getRandomWords = async (numberOfWords: number) => {
    try {
      const response = await fetch("wordbank.txt");
      const content = await response.text();
      const wordList = content.split("\n").filter((word) => word.trim() !== "");
      const randomWords: string[] = [];

      for (let i = 0; i < numberOfWords; ++i) {
        let word = "";
        while (word === "") {
          const randomIndex = Math.floor(Math.random() * wordList.length);
          word = wordList[randomIndex].trim();
        }
        randomWords.push(word);
      }

      setState((prev) => ({ ...prev, words: randomWords }));
    } catch (error) {
      console.error("Error loading words:", error);
    }
  };

  const handleInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    if (!state.startTime) {
      setState((prev) => ({ ...prev, startTime: Date.now() }));
    }

    // Update character count only when a new character is added
    if (input.length > (inputRef.current?.value.length || 0)) {
      setState((prev) => ({
        ...prev,
        charactersTyped: prev.charactersTyped + 1,
      }));
    }

    setState((prev) => ({ ...prev, currentInput: input }));

    // Real-time word validation
    const currentWord = state.words[state.activeWordIndex];
    const currentInput = input.trim();

    if (wordsRef.current[state.activeWordIndex]) {
      if (currentInput === currentWord.substring(0, currentInput.length)) {
        inputRef.current!.style.backgroundColor = "";
      } else {
        inputRef.current!.style.backgroundColor = "#875256";
      }
    }

    // Only allow moving to next word if current word is typed correctly
    if (input.slice(-1) === " ") {
      const inputWord = input.trim();

      if (inputWord === currentWord) {
        setState((prev) => ({
          ...prev,
          correctCharactersTyped:
            prev.correctCharactersTyped + currentWord.length + 1, // +1 for space
          activeWordIndex: prev.activeWordIndex + 1,
          enteredWords: prev.enteredWords + 1,
          currentInput: "",
        }));

        if (wordsRef.current[state.activeWordIndex]) {
          wordsRef.current[state.activeWordIndex].style.color = "#8AAC8B";
        }

        if (inputRef.current) {
          inputRef.current.value = "";
          inputRef.current.style.backgroundColor = "";
        }

        // Check if test is complete
        if (state.enteredWords + 1 >= state.wordCount) {
          const endTime = Date.now();
          const timeInMinutes = (endTime - state.startTime!) / 60000;
          const totalCharacters =
            state.correctCharactersTyped + currentWord.length + 1;

          const WPM = totalCharacters / 5 / timeInMinutes;
          const CPM = totalCharacters / timeInMinutes;
          const accuracy = Math.min(
            100,
            (totalCharacters / (state.charactersTyped + 1)) * 100
          );

          // Save the result to the database
          if (isAuthenticated) {
            try {
              await saveTestResult({
                userId: "userId",
                wpm: Math.round(WPM),
                cpm: Math.round(CPM),
                accuracy: Math.round(accuracy),
                wordCount: state.wordCount,
              });

              // Fetch updated best results after saving
              const results = await getTestResults();
              const bestForWordCount = results
                .filter((result) => result.wordCount === state.wordCount)
                .reduce(
                  (best, current) =>
                    !best || current.wpm > best.wpm ? current : best,
                  null
                );

              setState((prev) => ({
                ...prev,
                endTime,
                correctCharactersTyped: totalCharacters,
                WPM,
                CPM,
                accuracy,
                bestWPM: bestForWordCount?.wpm || prev.bestWPM,
              }));
            } catch (error) {
              console.error("Failed to save/fetch test result:", error);
              setState((prev) => ({
                ...prev,
                endTime,
                correctCharactersTyped: totalCharacters,
                WPM,
                CPM,
                accuracy,
              }));
            }
          } else {
            setState((prev) => ({
              ...prev,
              endTime,
              correctCharactersTyped: totalCharacters,
              WPM,
              CPM,
              accuracy,
            }));
          }

          if (inputRef.current) {
            inputRef.current.disabled = true;
          }
        }
      } else {
        // If word is incorrect, remove the space and keep focus on current word
        if (inputRef.current) {
          inputRef.current.value = inputWord;
          setState((prev) => ({ ...prev, currentInput: inputWord }));
        }
      }
    }
  };

  const restart = (newWordCount?: number) => {
    resetVariables();
    if (newWordCount) {
      setState((prev) => ({ ...prev, wordCount: newWordCount }));
      getRandomWords(newWordCount);
    } else {
      getRandomWords(state.wordCount);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.disabled = false;
      inputRef.current.focus();
      inputRef.current.style.backgroundColor = "";
    }

    // Reset word colors
    wordsRef.current.forEach((wordRef) => {
      if (wordRef) {
        wordRef.style.color = "#4f4f4f";
      }
    });
  };

  useEffect(() => {
    restart();
  }, []);

  useEffect(() => {
    const fetchBestResults = async () => {
      try {
        const data = await getTestResults();
        const bestForWordCount = data
          .filter((result) => result.wordCount === state.wordCount)
          .reduce(
            (best, current) =>
              !best || current.wpm > best.wpm ? current : best,
            null
          );

        setState((prev) => ({
          ...prev,
          bestWPM: bestForWordCount?.wpm || null,
        }));
      } catch (error) {
        console.error("Failed to fetch best results:", error);
      }
    };

    if (isAuthenticated) {
      fetchBestResults();
    }
  }, [state.wordCount, isAuthenticated]);

  const renderWord = (word: string, index: number) => {
    if (index === state.activeWordIndex) {
      const beforeCaret = word.slice(0, state.currentInput.length);
      const afterCaret = word.slice(state.currentInput.length);
      return (
        <span
          key={index}
          ref={(el) => {
            if (el) wordsRef.current[index] = el;
          }}
          style={{ color: "#ACA98A" }}
        >
          {beforeCaret}
          <span className="caret" />
          {afterCaret}{" "}
        </span>
      );
    }

    return (
      <span
        key={index}
        ref={(el) => {
          if (el) wordsRef.current[index] = el;
        }}
        style={{
          color: "#4f4f4f",
        }}
      >
        {word}{" "}
      </span>
    );
  };

  return (
    <div className="typing-container">
      <div className="flex flex-col items-center">
        <div className="w-full">
          <div className="word-container">
            {state.words.map((word, index) => renderWord(word, index))}
          </div>
          <input
            ref={inputRef}
            className="typing-input mb-8"
            type="text"
            onChange={handleInput}
            disabled={!!state.endTime}
            autoFocus
          />
        </div>

        {state.endTime && (
          <div className="flex flex-col items-center gap-4">
            {state.WPM && state.bestWPM && state.WPM > state.bestWPM && (
              <div className="text-accent text-xl font-bold animate-bounce mb-2">
                🎉 New Personal Best! 🎉
              </div>
            )}
            <div className="grid grid-cols-3 gap-8 mb-8 text-center">
              <div className="bg-secondary/30 p-4 rounded-lg">
                <div className="text-text-darker mb-1">CPM</div>
                <div className="text-2xl text-accent">
                  {Math.floor(state.CPM || 0)}
                </div>
              </div>
              <div
                className={`bg-secondary/30 p-4 rounded-lg ${
                  state.WPM && state.bestWPM && state.WPM > state.bestWPM
                    ? "ring-accent ring-4 animate-pulse"
                    : ""
                }`}
              >
                <div className="text-text-darker mb-1">WPM</div>
                <div className="text-2xl text-accent">
                  {Math.floor(state.WPM || 0)}
                </div>
                {state.bestWPM && (
                  <div className="text-text-darker text-sm mt-1">
                    Previous best: {state.bestWPM}
                  </div>
                )}
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <div className="text-text-darker mb-1">Accuracy</div>
                <div className="text-2xl text-accent">
                  {Math.floor(state.accuracy || 0)}%
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-4">
          {[25, 50, 100].map((count) => (
            <button
              key={count}
              onClick={() => restart(count)}
              className={`word-count-btn ${
                state.wordCount === count
                  ? "bg-secondary text-text"
                  : "text-text-darker"
              }`}
            >
              {count}
            </button>
          ))}
        </div>

        <button onClick={() => restart()} className="restart-btn">
          Restart
        </button>
      </div>
    </div>
  );
};
