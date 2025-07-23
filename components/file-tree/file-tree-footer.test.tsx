// components/file-tree/file-tree-footer.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import FileTreeFooter from "./file-tree-footer";

// Mock the utility functions
jest.mock("../../lib/utils", () => ({
  bytesToHumanReadable: jest.fn((bytes) => `${bytes} MB`),
  formatDateTime: jest.fn((date) => `Formatted: ${date}`),
}));

// Mock the knowledge base store
jest.mock("../../store/use-knowledge-base-store", () => ({
  useKnowledgeBaseStore: jest.fn(),
}));

// Mock the Skeleton component
jest.mock("../ui/skeleton", () => ({
  Skeleton: ({ className, ...props }: { className?: string }) => (
    <div data-testid="skeleton" className={className} {...props} />
  ),
}));

import { useKnowledgeBaseStore } from "../../store/use-knowledge-base-store";
import { bytesToHumanReadable, formatDateTime } from "../../lib/utils";

const mockUseKnowledgeBaseStore = useKnowledgeBaseStore as jest.MockedFunction<
  typeof useKnowledgeBaseStore
>;
const mockBytesToHumanReadable = bytesToHumanReadable as jest.MockedFunction<
  typeof bytesToHumanReadable
>;
const mockFormatDateTime = formatDateTime as jest.MockedFunction<
  typeof formatDateTime
>;

describe("FileTreeFooter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render skeleton when loading", () => {
    mockUseKnowledgeBaseStore.mockReturnValue({
      knowledgeBase: null,
      indexedItems: [],
      files: [],
      knowledgeBaseRawData: null,
      setKnowledgeBase: jest.fn(),
    });

    render(<FileTreeFooter isLoading={true} />);

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("w-full", "h-10", "rounded");
  });

  it("should render knowledge base data when not loading", () => {
    const mockKnowledgeBase = {
      totalSize: 1024000,
      lastUpdate: "2025-01-15T10:30:00.000Z",
    };

    mockUseKnowledgeBaseStore.mockReturnValue({
      knowledgeBase: mockKnowledgeBase,
      indexedItems: [],
      files: [],
      knowledgeBaseRawData: null,
      setKnowledgeBase: jest.fn(),
    });

    mockBytesToHumanReadable.mockReturnValue("1.00 MB");
    mockFormatDateTime.mockReturnValue("January 15, 2025 at 10:30:00 AM");

    render(<FileTreeFooter isLoading={false} />);

    // Check that utility functions are called with correct values
    expect(mockBytesToHumanReadable).toHaveBeenCalledWith(1024000);
    expect(mockFormatDateTime).toHaveBeenCalledWith("2025-01-15T10:30:00.000Z");

    // Check rendered content
    expect(screen.getByText("Total Size: 1.00 MB.")).toBeInTheDocument();
    expect(screen.getByText("Last update:")).toBeInTheDocument();
    expect(
      screen.getByText("January 15, 2025 at 10:30:00 AM")
    ).toBeInTheDocument();
  });

  it("should handle null knowledge base data", () => {
    mockUseKnowledgeBaseStore.mockReturnValue({
      knowledgeBase: null,
      indexedItems: [],
      files: [],
      knowledgeBaseRawData: null,
      setKnowledgeBase: jest.fn(),
    });

    mockBytesToHumanReadable.mockReturnValue("0 KB");
    mockFormatDateTime.mockReturnValue("N/A");

    render(<FileTreeFooter isLoading={false} />);

    // Should still call utility functions with undefined values
    expect(mockBytesToHumanReadable).toHaveBeenCalledWith(undefined);
    expect(mockFormatDateTime).toHaveBeenCalledWith(undefined);
  });

  it("should have correct structure and styling", () => {
    const mockKnowledgeBase = {
      totalSize: 512000,
      lastUpdate: "2025-01-14T15:45:00.000Z",
    };

    mockUseKnowledgeBaseStore.mockReturnValue({
      knowledgeBase: mockKnowledgeBase,
      indexedItems: [],
      files: [],
      knowledgeBaseRawData: null,
      setKnowledgeBase: jest.fn(),
    });

    mockBytesToHumanReadable.mockReturnValue("500.00 KB");
    mockFormatDateTime.mockReturnValue("January 14, 2025 at 3:45:00 PM");

    render(<FileTreeFooter isLoading={false} />);

    // Check for horizontal rule
    const hr = screen.getByRole("separator");
    expect(hr).toBeInTheDocument();
    expect(hr).toHaveClass("my-1");

    // Check container structure
    const container = screen
      .getByText("Total Size: 500.00 KB.")
      .closest("div")?.parentElement;
    expect(container).toHaveClass(
      "flex",
      "flex-row",
      "justify-between",
      "items-center"
    );
  });

  it("should have correct text styling for size and date", () => {
    const mockKnowledgeBase = {
      totalSize: 2048000,
      lastUpdate: "2025-01-10T08:20:00.000Z",
    };

    mockUseKnowledgeBaseStore.mockReturnValue({
      knowledgeBase: mockKnowledgeBase,
      indexedItems: [],
      files: [],
      knowledgeBaseRawData: null,
      setKnowledgeBase: jest.fn(),
    });

    mockBytesToHumanReadable.mockReturnValue("2.00 MB");
    mockFormatDateTime.mockReturnValue("January 10, 2025 at 8:20:00 AM");

    render(<FileTreeFooter isLoading={false} />);

    // Check size text styling
    const sizeText = screen.getByText("Total Size: 2.00 MB.");
    expect(sizeText).toHaveClass(
      "text-sm",
      "text-slate-600",
      "dark:text-slate-400"
    );

    // Check last update container styling
    const lastUpdateContainer = screen.getByText("Last update:").closest("div");
    expect(lastUpdateContainer).toHaveClass(
      "text-sm",
      "text-slate-600",
      "dark:text-slate-400"
    );

    // Check that date has correct styling
    const dateSpan = screen.getByText("January 10, 2025 at 8:20:00 AM");
    expect(dateSpan).toHaveClass("text-xs");
  });

  it("should have bold 'Last update:' text", () => {
    const mockKnowledgeBase = {
      totalSize: 1024,
      lastUpdate: "2025-01-01T00:00:00.000Z",
    };

    mockUseKnowledgeBaseStore.mockReturnValue({
      knowledgeBase: mockKnowledgeBase,
      indexedItems: [],
      files: [],
      knowledgeBaseRawData: null,
      setKnowledgeBase: jest.fn(),
    });

    mockBytesToHumanReadable.mockReturnValue("1.00 KB");
    mockFormatDateTime.mockReturnValue("January 1, 2025 at 12:00:00 AM");

    render(<FileTreeFooter isLoading={false} />);

    const strongElement = screen.getByText("Last update:");
    expect(strongElement.tagName).toBe("STRONG");
  });

  it("should not render hr and content when loading", () => {
    mockUseKnowledgeBaseStore.mockReturnValue({
      knowledgeBase: null,
      indexedItems: [],
      files: [],
      knowledgeBaseRawData: null,
      setKnowledgeBase: jest.fn(),
    });

    render(<FileTreeFooter isLoading={true} />);

    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    expect(screen.queryByText(/Total Size:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Last update:/)).not.toBeInTheDocument();
  });
});
