import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TypingTest } from "../TypingTest";
import { AuthProvider } from "../../context/AuthContext";

describe("TypingTest", () => {
  it("renders typing test interface", () => {
    render(
      <AuthProvider>
        <TypingTest />
      </AuthProvider>
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("allows typing input", async () => {
    render(
      <AuthProvider>
        <TypingTest />
      </AuthProvider>
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    expect(input).toHaveValue("test");
  });
});
