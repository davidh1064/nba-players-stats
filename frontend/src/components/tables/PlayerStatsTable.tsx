"use client";

import { Player } from "@/lib/services/playerService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-center">{title}</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Player</TableHead>
              <TableHead className="text-right">Season</TableHead>
              {stats.map((stat) => (
                <TableHead key={stat.key} className="text-right">
                  {stat.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow
                key={player.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onPlayerClick?.(player)}
              >
                <TableCell className="font-medium">
                  {player.name || "Unknown Player"}
                </TableCell>
                <TableCell className="text-right">{player.season || "N/A"}</TableCell>
                {stats.map((stat) => (
                  <TableCell key={stat.key} className="text-right">
                    {stat.key.includes("Pct")
                      ? `${(
                          (player[stat.key as keyof Player] as number) * 100
                        ).toFixed(1)}%`
                      : player[stat.key as keyof Player] || "N/A"}
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
