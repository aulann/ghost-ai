import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EditorNavbar } from "./editor-navbar";

// Mock lucide-react icons to simplify assertions and avoid SVG rendering issues
jest.mock("lucide-react", () => ({
  PanelLeftOpen: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="icon-panel-left-open" {...props} />
  ),
  PanelLeftClose: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="icon-panel-left-close" {...props} />
  ),
}));

describe("EditorNavbar", () => {
  describe("rendering", () => {
    it("renders a header element", () => {
      const { container } = render(
        <EditorNavbar isOpen={false} onToggle={jest.fn()} />
      );
      expect(container.querySelector("header")).toBeInTheDocument();
    });

    it("renders the sidebar toggle button", () => {
      render(<EditorNavbar isOpen={false} onToggle={jest.fn()} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("shows PanelLeftOpen icon when sidebar is closed", () => {
      render(<EditorNavbar isOpen={false} onToggle={jest.fn()} />);
      expect(screen.getByTestId("icon-panel-left-open")).toBeInTheDocument();
      expect(
        screen.queryByTestId("icon-panel-left-close")
      ).not.toBeInTheDocument();
    });

    it("shows PanelLeftClose icon when sidebar is open", () => {
      render(<EditorNavbar isOpen={true} onToggle={jest.fn()} />);
      expect(screen.getByTestId("icon-panel-left-close")).toBeInTheDocument();
      expect(
        screen.queryByTestId("icon-panel-left-open")
      ).not.toBeInTheDocument();
    });
  });

  describe("icon toggling based on isOpen", () => {
    it("switches from PanelLeftOpen to PanelLeftClose when isOpen changes to true", () => {
      const { rerender } = render(
        <EditorNavbar isOpen={false} onToggle={jest.fn()} />
      );
      expect(screen.getByTestId("icon-panel-left-open")).toBeInTheDocument();

      rerender(<EditorNavbar isOpen={true} onToggle={jest.fn()} />);
      expect(screen.getByTestId("icon-panel-left-close")).toBeInTheDocument();
      expect(
        screen.queryByTestId("icon-panel-left-open")
      ).not.toBeInTheDocument();
    });

    it("switches from PanelLeftClose to PanelLeftOpen when isOpen changes to false", () => {
      const { rerender } = render(
        <EditorNavbar isOpen={true} onToggle={jest.fn()} />
      );
      expect(screen.getByTestId("icon-panel-left-close")).toBeInTheDocument();

      rerender(<EditorNavbar isOpen={false} onToggle={jest.fn()} />);
      expect(screen.getByTestId("icon-panel-left-open")).toBeInTheDocument();
      expect(
        screen.queryByTestId("icon-panel-left-close")
      ).not.toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("calls onToggle when the button is clicked", async () => {
      const onToggle = jest.fn();
      render(<EditorNavbar isOpen={false} onToggle={onToggle} />);

      await userEvent.click(screen.getByRole("button"));

      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it("calls onToggle when the button is clicked while sidebar is open", async () => {
      const onToggle = jest.fn();
      render(<EditorNavbar isOpen={true} onToggle={onToggle} />);

      await userEvent.click(screen.getByRole("button"));

      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it("calls onToggle each time the button is clicked", async () => {
      const onToggle = jest.fn();
      render(<EditorNavbar isOpen={false} onToggle={onToggle} />);
      const button = screen.getByRole("button");

      await userEvent.click(button);
      await userEvent.click(button);
      await userEvent.click(button);

      expect(onToggle).toHaveBeenCalledTimes(3);
    });

    it("does not call onToggle when component renders without user interaction", () => {
      const onToggle = jest.fn();
      render(<EditorNavbar isOpen={false} onToggle={onToggle} />);
      expect(onToggle).not.toHaveBeenCalled();
    });
  });

  describe("structure", () => {
    it("contains three layout sections", () => {
      const { container } = render(
        <EditorNavbar isOpen={false} onToggle={jest.fn()} />
      );
      // header has three direct div children (left, center, right sections)
      const header = container.querySelector("header");
      const divChildren = Array.from(header?.children ?? []).filter(
        (el) => el.tagName === "DIV"
      );
      expect(divChildren).toHaveLength(3);
    });
  });
});