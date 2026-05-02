import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProjectSidebar } from "./project-sidebar";

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Plus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="icon-plus" {...props} />
  ),
  X: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="icon-x" {...props} />
  ),
}));

describe("ProjectSidebar", () => {
  describe("rendering", () => {
    it("renders the Projects title", () => {
      render(<ProjectSidebar isOpen={false} />);
      expect(screen.getByText("Projects")).toBeInTheDocument();
    });

    it("renders the close button", () => {
      render(<ProjectSidebar isOpen={false} />);
      // The close button contains the X icon
      expect(screen.getByTestId("icon-x")).toBeInTheDocument();
    });

    it("renders the My Projects tab trigger", () => {
      render(<ProjectSidebar isOpen={false} />);
      expect(screen.getByText("My Projects")).toBeInTheDocument();
    });

    it("renders the Shared tab trigger", () => {
      render(<ProjectSidebar isOpen={false} />);
      expect(screen.getByText("Shared")).toBeInTheDocument();
    });

    it("renders the New Project button", () => {
      render(<ProjectSidebar isOpen={false} />);
      expect(
        screen.getByRole("button", { name: /new project/i })
      ).toBeInTheDocument();
    });

    it("renders the Plus icon in the New Project button", () => {
      render(<ProjectSidebar isOpen={false} />);
      expect(screen.getByTestId("icon-plus")).toBeInTheDocument();
    });

    it("shows empty state for My Projects tab by default", () => {
      render(<ProjectSidebar isOpen={false} />);
      expect(screen.getByText("No projects yet.")).toBeInTheDocument();
    });
  });

  describe("visibility based on isOpen", () => {
    it("applies translate-x-0 class when isOpen is true", () => {
      const { container } = render(<ProjectSidebar isOpen={true} />);
      const sidebar = container.firstChild as HTMLElement;
      expect(sidebar.className).toContain("translate-x-0");
    });

    it("applies -translate-x-full class when isOpen is false", () => {
      const { container } = render(<ProjectSidebar isOpen={false} />);
      const sidebar = container.firstChild as HTMLElement;
      expect(sidebar.className).toContain("-translate-x-full");
    });

    it("switches from hidden to visible when isOpen changes to true", () => {
      const { container, rerender } = render(
        <ProjectSidebar isOpen={false} />
      );
      const sidebar = container.firstChild as HTMLElement;
      expect(sidebar.className).toContain("-translate-x-full");

      rerender(<ProjectSidebar isOpen={true} />);
      expect(sidebar.className).toContain("translate-x-0");
      expect(sidebar.className).not.toContain("-translate-x-full");
    });

    it("switches from visible to hidden when isOpen changes to false", () => {
      const { container, rerender } = render(<ProjectSidebar isOpen={true} />);
      const sidebar = container.firstChild as HTMLElement;
      expect(sidebar.className).toContain("translate-x-0");

      rerender(<ProjectSidebar isOpen={false} />);
      expect(sidebar.className).toContain("-translate-x-full");
    });
  });

  describe("tabs", () => {
    it("shows My Projects content by default", () => {
      render(<ProjectSidebar isOpen={true} />);
      expect(screen.getByText("No projects yet.")).toBeInTheDocument();
    });

    it("shows Shared tab content when Shared tab is clicked", async () => {
      render(<ProjectSidebar isOpen={true} />);
      await userEvent.click(screen.getByText("Shared"));
      expect(screen.getByText("No shared projects.")).toBeInTheDocument();
    });

    it("hides My Projects empty state when Shared tab is active", async () => {
      render(<ProjectSidebar isOpen={true} />);
      await userEvent.click(screen.getByText("Shared"));
      // @base-ui removes inactive tab panels from the DOM
      expect(screen.queryByText("No projects yet.")).not.toBeInTheDocument();
    });

    it("can switch back to My Projects tab from Shared", async () => {
      render(<ProjectSidebar isOpen={true} />);
      await userEvent.click(screen.getByText("Shared"));
      expect(screen.getByText("No shared projects.")).toBeInTheDocument();

      await userEvent.click(screen.getByText("My Projects"));
      expect(screen.getByText("No projects yet.")).toBeVisible();
    });
  });

  describe("close button", () => {
    it("calls onClose when close button is clicked", async () => {
      const onClose = jest.fn();
      render(<ProjectSidebar isOpen={true} onClose={onClose} />);

      // The close button is the one containing the X icon
      const closeButton = screen.getByTestId("icon-x").closest("button");
      expect(closeButton).toBeInTheDocument();
      await userEvent.click(closeButton!);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not throw when onClose is not provided and close button is clicked", async () => {
      render(<ProjectSidebar isOpen={true} />);
      const closeButton = screen.getByTestId("icon-x").closest("button");
      await expect(userEvent.click(closeButton!)).resolves.not.toThrow();
    });

    it("does not call onClose when component renders without interaction", () => {
      const onClose = jest.fn();
      render(<ProjectSidebar isOpen={true} onClose={onClose} />);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("structure and accessibility", () => {
    it("renders the sidebar as a div with fixed positioning", () => {
      const { container } = render(<ProjectSidebar isOpen={false} />);
      const sidebar = container.firstChild as HTMLElement;
      expect(sidebar.tagName).toBe("DIV");
      expect(sidebar.className).toContain("fixed");
    });

    it("is always present in the DOM regardless of isOpen", () => {
      const { container } = render(<ProjectSidebar isOpen={false} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("sidebar is visible in DOM even when closed (CSS-only hiding)", () => {
      render(<ProjectSidebar isOpen={false} />);
      // Content is always rendered, only CSS transform hides it
      expect(screen.getByText("Projects")).toBeInTheDocument();
    });
  });
});