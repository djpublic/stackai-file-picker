// components/file-tree/loading/file-tree-row.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { FileTreeRowLoading } from "./file-tree-row";

// Mock the Skeleton component
jest.mock("../../ui/skeleton", () => ({
  Skeleton: ({ className, ...props }: { className?: string }) => (
    <div data-testid="skeleton" className={className} {...props} />
  ),
}));

describe("FileTreeRowLoading", () => {
  it("should render correctly", () => {
    render(
      <table>
        <tbody>
          <FileTreeRowLoading />
        </tbody>
      </table>
    );

    // Check that the tr element is rendered
    const row = screen.getByRole("row");
    expect(row).toBeInTheDocument();
  });

  it("should render table cell with correct colspan", () => {
    render(
      <table>
        <tbody>
          <FileTreeRowLoading />
        </tbody>
      </table>
    );

    // Check that the td has colspan of 3
    const cell = screen.getByRole("cell");
    expect(cell).toHaveAttribute("colspan", "3");
  });

  it("should have correct CSS classes", () => {
    render(
      <table>
        <tbody>
          <FileTreeRowLoading />
        </tbody>
      </table>
    );

    const cell = screen.getByRole("cell");
    expect(cell).toHaveClass("p-3", "bg-muted/70");
  });

  it("should render skeleton components", () => {
    render(
      <table>
        <tbody>
          <FileTreeRowLoading />
        </tbody>
      </table>
    );

    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons).toHaveLength(4); // 2 pairs of skeletons
  });

  it("should render skeleton with correct dimensions", () => {
    render(
      <table>
        <tbody>
          <FileTreeRowLoading />
        </tbody>
      </table>
    );

    const skeletons = screen.getAllByTestId("skeleton");

    // Check that some skeletons have w-4 h-4 class
    const smallSkeletons = skeletons.filter(
      (skeleton) =>
        skeleton.classList.contains("w-4") && skeleton.classList.contains("h-4")
    );
    expect(smallSkeletons).toHaveLength(2);

    // Check that some skeletons have w-full h-4 class
    const fullWidthSkeletons = skeletons.filter(
      (skeleton) =>
        skeleton.classList.contains("w-full") &&
        skeleton.classList.contains("h-4")
    );
    expect(fullWidthSkeletons).toHaveLength(2);
  });

  it("should have proper spacing structure", () => {
    render(
      <table>
        <tbody>
          <FileTreeRowLoading />
        </tbody>
      </table>
    );

    // Check that space-y-2 class is applied to the container
    const spaceContainer = screen.getByRole("cell").firstElementChild;
    expect(spaceContainer).toHaveClass("space-y-2");
  });

  it("should render multiple flex containers with gap", () => {
    render(
      <table>
        <tbody>
          <FileTreeRowLoading />
        </tbody>
      </table>
    );

    // Check for flex containers with gap-2
    const flexContainers = screen
      .getByRole("cell")
      .querySelectorAll(".flex.items-center.gap-2");
    expect(flexContainers).toHaveLength(2);
  });
});
