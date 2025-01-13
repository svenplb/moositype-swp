import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { TypingTest } from "../TypingTest";
import { AuthProvider } from "../../context/AuthContext";
import * as api from "../../services/api";

// Mock wordbank.txt
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve("test\nword\nspeed\ntyping\n"),
  } as Response)
);

// Mock calls
// ! Keine ahnung wie das funktioniert, ich hasse es so sehr.
vi.mock("../../services/api", () => ({
  saveTestResult: vi.fn(),
  getTestResults: vi.fn().mockResolvedValue([]),
}));

describe("TypingTest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders input field", () => {
    render(
      <AuthProvider>
        <TypingTest />
      </AuthProvider>
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders word count buttons", () => {
    render(
      <AuthProvider>
        <TypingTest />
      </AuthProvider>
    );
    [25, 50, 100].forEach((count) => {
      expect(screen.getByText(count.toString())).toBeInTheDocument();
    });
  });

  it("renders restart button", () => {
    render(
      <AuthProvider>
        <TypingTest />
      </AuthProvider>
    );
    expect(screen.getByText("Restart")).toBeInTheDocument();
  });

  it("changes word count when clicking word count button", async () => {
    render(
      <AuthProvider>
        <TypingTest />
      </AuthProvider>
    );

    const fiftyWordButton = screen.getByText("50");
    await act(async () => {
      fireEvent.click(fiftyWordButton);
    });

    // button sollte aktiv sein
    expect(fiftyWordButton).toHaveClass("bg-secondary");
  });

  it("clears input on restart", async () => {
    render(
      <AuthProvider>
        <TypingTest />
      </AuthProvider>
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });

    const restartButton = screen.getByText("Restart");
    await act(async () => {
      fireEvent.click(restartButton);
    });

    expect(input).toHaveValue("");
  });
});
