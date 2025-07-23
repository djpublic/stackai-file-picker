// components/home/page-header.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import PageHeader from "./page-header";

// Mock the Skeleton component
jest.mock("../ui/skeleton", () => ({
  Skeleton: ({ className, ...props }: { className?: string }) => (
    <div data-testid="skeleton" className={className} {...props} />
  ),
}));

describe("PageHeader", () => {
  it("should render skeleton when loading", () => {
    render(<PageHeader isLoading={true} />);

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("w-full", "h-10", "rounded");
  });

  it("should render title when not loading", () => {
    render(<PageHeader isLoading={false} title="Test Knowledge Base" />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Knowledge Bases / Test Knowledge Base");
  });

  it("should render default title when no title provided", () => {
    render(<PageHeader isLoading={false} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Knowledge Bases / Knowledge Base");
  });

  it("should have correct container structure and classes", () => {
    render(<PageHeader isLoading={false} title="Test KB" />);

    const outerContainer = screen
      .getByRole("heading")
      .closest("div")?.parentElement;
    expect(outerContainer).toHaveClass(
      "w-full",
      "p-8",
      "bg-white",
      "dark:bg-slate-800",
      "rounded-xl",
      "shadow",
      "flex",
      "gap-6",
      "h-full",
      "border-b",
      "mb-6"
    );
  });

  it("should have correct aria-label", () => {
    render(<PageHeader isLoading={false} title="My Test KB" />);

    const ariaContainer = screen.getByLabelText(
      "Update Knowledge Base: My Test KB"
    );
    expect(ariaContainer).toBeInTheDocument();
  });

  it("should have correct heading classes when not loading", () => {
    render(<PageHeader isLoading={false} title="Test KB" />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass("text-2xl", "lg:text-3xl", "font-bold");
  });

  it("should have correct text content structure", () => {
    render(<PageHeader isLoading={false} title="Custom Title" />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toBe("Knowledge Bases / Custom Title");

    // Check that the title is wrapped in a strong tag
    const strongElement = heading.querySelector("strong");
    expect(strongElement).toBeInTheDocument();
    expect(strongElement).toHaveTextContent("Custom Title");
  });

  it("should have correct inner container classes", () => {
    render(<PageHeader isLoading={false} title="Test" />);

    const innerContainer = screen.getByLabelText("Update Knowledge Base: Test");
    expect(innerContainer).toHaveClass(
      "tracking-tight",
      "text-slate-900",
      "dark:text-slate-100",
      "flex",
      "flex-row",
      "justify-between",
      "w-full",
      "flex-wrap"
    );
  });

  it("should handle empty title gracefully", () => {
    render(<PageHeader isLoading={false} title="" />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Knowledge Bases /");
  });

  it("should handle very long title", () => {
    const longTitle =
      "This is a very long knowledge base title that might wrap to multiple lines";
    render(<PageHeader isLoading={false} title={longTitle} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(`Knowledge Bases / ${longTitle}`);
  });

  it("should not render heading when loading", () => {
    render(<PageHeader isLoading={true} title="Should not show" />);

    const heading = screen.queryByRole("heading", { level: 1 });
    expect(heading).not.toBeInTheDocument();
  });
});
