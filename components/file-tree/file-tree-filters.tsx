"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search } from "lucide-react";

// Filter options for the dropdown
const FILTER_OPTIONS = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "date-newest", label: "Date (Newest)" },
  { value: "date-oldest", label: "Date (Oldest)" },
];

interface FileTreeFiltersProps {
  onFilterChange?: (filter: string) => void;
  onSearchChange?: (search: string) => void;
}

export default function FileTreeFilters({
  onFilterChange,
  onSearchChange,
}: FileTreeFiltersProps) {
  const [selectedFilter, setSelectedFilter] = useState("name-asc");
  const [searchQuery, setSearchQuery] = useState("");

  // Handle filter selection
  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    onFilterChange?.(filter);
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  // Get display label for selected filter
  const getFilterLabel = () => {
    return (
      FILTER_OPTIONS.find((option) => option.value === selectedFilter)?.label ||
      "Filter"
    );
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {getFilterLabel()}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {FILTER_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleFilterSelect(option.value)}
              className={selectedFilter === option.value ? "bg-accent" : ""}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
