"use client";

import { useState, useMemo } from "react";
import { Player } from "@/lib/services/playerService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp } from "lucide-react";

interface PlayerStatsTableProps {
  players: Player[];
  title: string;
  onPlayerClick?: (player: Player) => void;
}

export default function PlayerStatsTable({
  players,
  title,
  onPlayerClick,
}: PlayerStatsTableProps) {
  const stats = [
    { key: "gp", label: "Games Played" },
    { key: "pts", label: "Points" },
    { key: "reb", label: "Rebounds" },
    { key: "ast", label: "Assists" },
    { key: "netRating", label: "Net Rating" },
    { key: "orebPct", label: "OREB%" },
    { key: "drebPct", label: "DREB%" },
    { key: "usgPct", label: "USG%" },
    { key: "tsPct", label: "TS%" },
    { key: "astPct", label: "AST%" },
  ];

  const [sortKey, setSortKey] = useState<keyof Player | "name">("pts");
  const [ascending, setAscending] = useState(false);

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      const aValue = sortKey === "name" ? a.name : (a[sortKey] ?? 0);
      const bValue = sortKey === "name" ? b.name : (b[sortKey] ?? 0);

      if (sortKey === "name") {
        return ascending
          ? (aValue as string).localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue as string);
      } else {
        return ascending
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });
  }, [players, sortKey, ascending]);

  const toggleSort = (key: keyof Player | "name") => {
    if (key === sortKey) {
      setAscending((prev) => !prev);
    } else {
      setSortKey(key);
      setAscending(false); // default to descending
    }
  };

  const renderSortIcon = (key: keyof Player | "name") => {
    if (sortKey !== key) return null;
    return ascending ? (
      <ArrowUp className="inline h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="inline h-4 w-4 ml-1" />
    );
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-center">{title}</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="min-w-[200px] cursor-pointer"
                onClick={() => toggleSort("name")}
              >
                Player {renderSortIcon("name")}
              </TableHead>
              <TableHead className="text-right">Season</TableHead>
              {stats.map((stat) => (
                <TableHead
                  key={stat.key}
                  className="text-right cursor-pointer"
                  onClick={() => toggleSort(stat.key as keyof Player)}
                >
                  {stat.label} {renderSortIcon(stat.key as keyof Player)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.map((player) => (
              <TableRow
                key={player.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onPlayerClick?.(player)}
              >
                <TableCell className="font-medium">
                  {player.name || "Unknown Player"}
                </TableCell>
                <TableCell className="text-right">
                  {player.season || "N/A"}
                </TableCell>
                {stats.map((stat) => (
                  <TableCell key={stat.key} className="text-right">
                    {stat.key.includes("Pct")
                      ? player[stat.key as keyof Player] != null
                        ? `${((player[stat.key as keyof Player] as number) * 100).toFixed(1)}%`
                        : "N/A"
                      : player[stat.key as keyof Player] ?? "N/A"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
