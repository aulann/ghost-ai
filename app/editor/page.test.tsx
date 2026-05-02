import React from "react";
import { render, screen } from "@testing-library/react";

import EditorPage from "./page";

describe("EditorPage", () => {
  it("renders the canvas placeholder text", () => {
    render(<EditorPage />);
    expect(screen.getByText("Canvas goes here.")).toBeInTheDocument();
  });

  it("renders the placeholder inside a paragraph element", () => {
    render(<EditorPage />);
    const paragraph = screen.getByText("Canvas goes here.");
    expect(paragraph.tagName).toBe("P");
  });

  it("renders a containing div", () => {
    const { container } = render(<EditorPage />);
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });

  it("renders exactly one paragraph", () => {
    const { container } = render(<EditorPage />);
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });

  it("does not render any interactive elements", () => {
    render(<EditorPage />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
  });
});