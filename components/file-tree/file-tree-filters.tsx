"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

import { Search } from "lucide-react";
import { useFileTreeStore } from "@/store/use-file-tree-store";
import { useDebounce } from "@uidotdev/usehooks";
import { Skeleton } from "../ui/skeleton";

export default function FileTreeFilters({ isLoading }: { isLoading: boolean }) {
  const { setSearch } = useFileTreeStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce the search term with 300ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Effect to update the store when debounced search term changes
  useEffect(() => {
    setSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearch]);

  if (isLoading) {
    return <Skeleton className="w-full h-10 rounded" />;
  }

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
