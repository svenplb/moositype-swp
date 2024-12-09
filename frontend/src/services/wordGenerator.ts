export class WordGenerator {
  private wordList: string[];

  constructor(language: string) {
    this.wordList = this.loadWordList(language);
  }

  generateWords(count: number, withPunctuation: boolean): string[] {
    const words = Array(count)
      .fill(0)
      .map(() => this.getRandomWord());

    return withPunctuation ? this.addPunctuation(words) : words;
  }

  private addPunctuation(words: string[]): string[] {
    return words.map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      // Add punctuation logic similar to original code
      return word;
    });
  }
}
