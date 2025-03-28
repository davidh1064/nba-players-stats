"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { teamNameToAbbreviation } from "@/lib/constants/teamAbbreviations";

const teamNames = Object.keys(teamNameToAbbreviation);

interface TeamComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function TeamCombobox({ value, onChange }: TeamComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? value : "Select a team"}
          <div className="flex items-center gap-1">
            {value && (
              <X
                onClick={(e) => {
                  onChange("");
                }}
                className="h-4 w-4 text-gray-400 hover:text-gray-600"
              />
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0 max-h-60 overflow-y-auto z-50">
        <Command>
          <CommandInput placeholder="Search teams..." />
          <CommandEmpty>No team found.</CommandEmpty>
          <CommandGroup>
            {teamNames.map((team) => (
              <CommandItem
                key={team}
                value={team}
                onSelect={(selectedTeam) => {
                  onChange(selectedTeam);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === team ? "opacity-100" : "opacity-0"
                  )}
                />
                {team}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
