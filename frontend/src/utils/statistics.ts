export const calculateWPM = (
  correctChars: number,
  timeElapsed: number,
  errors: number
): number => {
  const minutes = timeElapsed / 60000; // Convert ms to minutes
  const words = correctChars / 5 - errors; // Standard word length is 5 chars
  return Math.round(words / minutes);
};

export const calculateAccuracy = (
  correctChars: number,
  totalChars: number
): number => {
  return Math.round((correctChars / totalChars) * 100);
};
