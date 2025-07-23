import {
  bytesToHumanReadable,
  getConnectionResourceUrl,
  sortFilesAndFolders,
  removeDuplicated,
  removeDuplicatedById,
  rootEntry,
  formatDateTime,
  enhanceItems,
} from "./utils";
import {
  FileTreeEntryProps,
  FileTreeResourceProps,
} from "@/types/file-picker.types";

describe("Utils", () => {
  describe("bytesToHumanReadable", () => {
    it("should return '0 KB' for 0 bytes", () => {
      expect(bytesToHumanReadable(0)).toBe("0 KB");
    });

    it("should format bytes correctly", () => {
      expect(bytesToHumanReadable(500)).toBe("500.00 B");
    });

    it("should format kilobytes correctly", () => {
      expect(bytesToHumanReadable(1024)).toBe("1.00 KB");
    });

    it("should format megabytes correctly", () => {
      expect(bytesToHumanReadable(1024 * 1024)).toBe("1.00 MB");
    });

    it("should format gigabytes correctly", () => {
      expect(bytesToHumanReadable(1024 * 1024 * 1024)).toBe("1.00 GB");
    });

    it("should format terabytes correctly", () => {
      expect(bytesToHumanReadable(1024 * 1024 * 1024 * 1024)).toBe("1.00 TB");
    });

    it("should handle decimal values", () => {
      expect(bytesToHumanReadable(1536)).toBe("1.50 KB");
    });
  });

  describe("getConnectionResourceUrl", () => {
    const mockResource: FileTreeResourceProps = {
      knowledgeBaseId: "kb-123",
      connectionId: "conn-456",
    };

    it("should generate knowledge-base URL correctly", () => {
      const url = getConnectionResourceUrl(
        mockResource,
        "/folder/file.txt",
        "knowledge-base"
      );
      expect(url).toBe(
        "/api/knowledge-bases/kb-123/resources?resource_path=%2F/folder/file.txt"
      );
    });

    it("should generate knowledge-base URL for root path", () => {
      const url = getConnectionResourceUrl(mockResource, "/", "knowledge-base");
      expect(url).toBe(
        "/api/knowledge-bases/kb-123/resources?resource_path=%2F"
      );
    });

    it("should generate connection-resource URL correctly", () => {
      const url = getConnectionResourceUrl(
        mockResource,
        "/folder/file.txt",
        "connection-resource",
        "search-term"
      );
      expect(url).toBe(
        "/api/connections/conn-456?resource_id=%2Ffolder%2Ffile.txt&search=search-term"
      );
    });

    it("should handle connection-resource URL without search", () => {
      const url = getConnectionResourceUrl(
        mockResource,
        "/folder/file.txt",
        "connection-resource"
      );
      expect(url).toBe(
        "/api/connections/conn-456?resource_id=%2Ffolder%2Ffile.txt&search=undefined"
      );
    });
  });

  describe("sortFilesAndFolders", () => {
    const mockFiles: FileTreeEntryProps[] = [
      {
        id: "1",
        name: "file.txt",
        type: "file",
        path: "/file.txt",
        status: "indexed",
      },
      {
        id: "2",
        name: "folder",
        type: "directory",
        path: "/folder",
        status: "indexed",
      },
      {
        id: "3",
        name: "another-file.txt",
        type: "file",
        path: "/another-file.txt",
        status: "indexed",
      },
      {
        id: "4",
        name: "another-folder",
        type: "directory",
        path: "/another-folder",
        status: "indexed",
      },
    ];

    it("should sort directories before files", () => {
      const sorted = sortFilesAndFolders(mockFiles);
      expect(sorted[0].type).toBe("directory");
      expect(sorted[1].type).toBe("directory");
      expect(sorted[2].type).toBe("file");
      expect(sorted[3].type).toBe("file");
    });

    it("should sort alphabetically within each type", () => {
      const sorted = sortFilesAndFolders(mockFiles);
      expect(sorted[0].name).toBe("another-folder");
      expect(sorted[1].name).toBe("folder");
      expect(sorted[2].name).toBe("another-file.txt");
      expect(sorted[3].name).toBe("file.txt");
    });

    it("should handle empty array", () => {
      const sorted = sortFilesAndFolders([]);
      expect(sorted).toEqual([]);
    });
  });

  describe("removeDuplicated", () => {
    it("should remove duplicate strings", () => {
      const input = ["a", "b", "a", "c", "b"];
      const result = removeDuplicated(input);
      expect(result).toEqual(["a", "b", "c"]);
    });

    it("should handle empty array", () => {
      const result = removeDuplicated([]);
      expect(result).toEqual([]);
    });

    it("should handle array with no duplicates", () => {
      const input = ["a", "b", "c"];
      const result = removeDuplicated(input);
      expect(result).toEqual(["a", "b", "c"]);
    });
  });

  describe("removeDuplicatedById", () => {
    const mockEntries: FileTreeEntryProps[] = [
      {
        id: "1",
        name: "file1",
        type: "file",
        path: "/file1",
        status: "indexed",
      },
      {
        id: "2",
        name: "file2",
        type: "file",
        path: "/file2",
        status: "indexed",
      },
      {
        id: "1",
        name: "file1-duplicate",
        type: "file",
        path: "/file1-duplicate",
        status: "indexed",
      },
    ];

    it("should remove entries with duplicate IDs", () => {
      const result = removeDuplicatedById(mockEntries);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("1");
      expect(result[1].id).toBe("2");
    });

    it("should keep first occurrence of duplicate", () => {
      const result = removeDuplicatedById(mockEntries);
      expect(result[0].name).toBe("file1");
    });

    it("should handle empty array", () => {
      const result = removeDuplicatedById([]);
      expect(result).toEqual([]);
    });
  });

  describe("rootEntry", () => {
    it("should have correct properties", () => {
      expect(rootEntry.id).toBe("/");
      expect(rootEntry.name).toBe("Root");
      expect(rootEntry.path).toBe("/");
      expect(rootEntry.type).toBe("directory");
    });
  });

  describe("formatDateTime", () => {
    it("should format ISO date string correctly in UTC", () => {
      const isoDate = "2025-07-22T14:17:37.878313Z";
      const result = formatDateTime(isoDate);
      // Test that it returns a properly formatted string in UTC timezone
      expect(result).toBe("July 22, 2025 at 02:17:37 PM");
    });

    it("should handle different date format in UTC", () => {
      const isoDate = "2024-01-01T00:00:00.000Z";
      const result = formatDateTime(isoDate);
      expect(result).toBe("January 1, 2024 at 12:00:00 AM");
    });
  });

  describe("enhanceItems", () => {
    const kbFolderData: FileTreeEntryProps[] = [
      {
        id: "1",
        name: "file1",
        type: "file",
        path: "/file1",
        status: "indexed",
      },
      {
        id: "2",
        name: "file2",
        type: "file",
        path: "/file2",
        status: "pending",
      },
    ];

    const connectionFolderData: FileTreeEntryProps[] = [
      {
        id: "1",
        name: "file1",
        type: "file",
        path: "/file1",
        status: "indexed",
      },
      {
        id: "3",
        name: "file3",
        type: "file",
        path: "/file3",
        status: "indexed",
      },
    ];

    it("should return knowledge base data for knowledge-base type", () => {
      const result = enhanceItems(
        "knowledge-base",
        kbFolderData,
        connectionFolderData
      );
      expect(result).toEqual(kbFolderData);
    });

    it("should enhance connection data with status for connection type", () => {
      const result = enhanceItems(
        "connection-resource",
        kbFolderData,
        connectionFolderData
      );
      expect(result).toHaveLength(2);
      expect(result[0].status).toBe("indexed");
      expect(result[1].status).toBeUndefined();
    });

    it("should handle undefined connection data", () => {
      const result = enhanceItems(
        "connection-resource",
        kbFolderData,
        undefined
      );

      expect(result).toEqual([]);
    });

    it("should handle empty arrays", () => {
      const result = enhanceItems("connection-resource", [], []);
      expect(result).toEqual([]);
    });
  });
});
