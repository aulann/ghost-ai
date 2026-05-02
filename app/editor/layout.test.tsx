import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EditorLayout from "./layout";

// Mock child components to isolate the layout's own logic
jest.mock("@/components/editor/editor-navbar", () => ({
  EditorNavbar: ({
    isOpen,
    onToggle,
  }: {
    isOpen: boolean;
    onToggle: () => void;
  }) => (
    <div data-testid="editor-navbar" data-is-open={isOpen}>
      <button data-testid="navbar-toggle" onClick={onToggle}>
        Toggle
      </button>
    </div>
  ),
}));

jest.mock("@/components/editor/project-sidebar", () => ({
  ProjectSidebar: ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose?: () => void;
  }) => (
    <div data-testid="project-sidebar" data-is-open={isOpen}>
      <button data-testid="sidebar-close" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));

describe("EditorLayout", () => {
  describe("rendering", () => {
    it("renders EditorNavbar", () => {
      render(
        <EditorLayout>
          <div />
        </EditorLayout>
      );
      expect(screen.getByTestId("editor-navbar")).toBeInTheDocument();
    });

    it("renders ProjectSidebar", () => {
      render(
        <EditorLayout>
          <div />
        </EditorLayout>
      );
      expect(screen.getByTestId("project-sidebar")).toBeInTheDocument();
    });

    it("renders children inside main element", () => {
      render(
        <EditorLayout>
          <span data-testid="child-content">Hello</span>
        </EditorLayout>
      );
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
      expect(main).toContainElement(screen.getByTestId("child-content"));
    });

    it("renders a main element as the content area", () => {
      render(
        <EditorLayout>
          <div />
        </EditorLayout>
      );
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });

  describe("sidebar state management", () => {
    it("passes isOpen=false to EditorNavbar by default", () => {
      render(
        <EditorLayout>
          <div />
        </EditorLayout>
      );
      expect(screen.getByTestId("editor-navbar")).toHaveAttribute(
        "data-is-open",
        "false"
      );
    });

    it("passes isOpen=false to ProjectSidebar by default", () => {
      render(
        <EditorLayout>
          <div />
        </EditorLayout>
      );
      expect(screen.getByTestId("project-sidebar")).toHaveAttribute(
        "data-is-open",
        "false"
      );
    });

    it("opens sidebar when navbar toggle is clicked", async () => {
      render(
        <EditorLayout>
          <div />
        </EditorLayout>
      );

      await userEvent.click(screen.getByTestId("navbar-toggle"));

      expect(screen.getByTestId("editor-navbar")).toHaveAttribute(
        "data-is-open",
        "true"
      );
      expect(screen.getByTestId("project-sidebar")).toHaveAttribute(
        "data-is-open",
        "true"
      );
    });

    it("closes sidebar when navbar toggle is clicked a second time", async () => {
      render(
        <EditorLayout>
          <div />
        </EditorLayout>
      );

      await userEvent.click(screen.getByTestId("navbar-toggle"));
      await userEvent.click(screen.getByTestId("navbar-toggle"));

      expect(screen.getByTestId("editor-navbar")).toHaveAttribute(
        "data-is-open",
        "false"
      );
      expect(screen.getByTestId("project-sidebar")).toHaveAttribute(
        "data-is-open",
        "false"
      );
    });

    it("closes sidebar when sidebar close button is clicked", async () => {
      render(
        <EditorLayout>
          <div />
        </EditorLayout>
      );

      // First open the sidebar
      await userEvent.click(screen.getByTestId("navbar-toggle"));
      expect(screen.getByTestId("project-sidebar")).toHaveAttribute(
        "data-is-open",
        "true"
      );

      // Then close via sidebar's own close button
      await userEvent.click(screen.getByTestId("sidebar-close"));
      expect(screen.getByTestId("project-sidebar")).toHaveAttribute(
        "data-is-open",
        "false"
      );
    });

    it("EditorNavbar and ProjectSidebar always share the same isOpen state", async () => {
      render(
        <EditorLayout>
          <div />
        </EditorLayout>
      );
      const navbar = screen.getByTestId("editor-navbar");
      const sidebar = screen.getByTestId("project-sidebar");

      // Both start closed
      expect(navbar.getAttribute("data-is-open")).toBe(
        sidebar.getAttribute("data-is-open")
      );

      await userEvent.click(screen.getByTestId("navbar-toggle"));

      // Both open together
      expect(navbar.getAttribute("data-is-open")).toBe(
        sidebar.getAttribute("data-is-open")
      );
    });

    it("toggling navbar toggle multiple times reflects correct open state", async () => {
      render(
        <EditorLayout>
          <div />
        </EditorLayout>
      );
      const toggle = screen.getByTestId("navbar-toggle");
      const sidebar = screen.getByTestId("project-sidebar");

      await userEvent.click(toggle); // open
      expect(sidebar.getAttribute("data-is-open")).toBe("true");

      await userEvent.click(toggle); // close
      expect(sidebar.getAttribute("data-is-open")).toBe("false");

      await userEvent.click(toggle); // open again
      expect(sidebar.getAttribute("data-is-open")).toBe("true");
    });
  });

  describe("layout structure", () => {
    it("renders a top-level div wrapper", () => {
      const { container } = render(
        <EditorLayout>
          <div />
        </EditorLayout>
      );
      expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
    });

    it("renders multiple children correctly", () => {
      render(
        <EditorLayout>
          <span data-testid="child-a">A</span>
          <span data-testid="child-b">B</span>
        </EditorLayout>
      );
      expect(screen.getByTestId("child-a")).toBeInTheDocument();
      expect(screen.getByTestId("child-b")).toBeInTheDocument();
    });
  });
});