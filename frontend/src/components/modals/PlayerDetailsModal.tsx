"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Player } from "@/lib/services/playerService";

interface PlayerDetailsModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlayerDetailsModal({
  player,
  isOpen,
  onClose,
}: PlayerDetailsModalProps) {
  if (!player) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {player.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700">Basic Information</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-600">Team:</span>
              <span>{player.team}</span>
              <span className="text-gray-600">Season:</span>
              <span>{player.season}</span>
              <span className="text-gray-600">Country:</span>
              <span>{player.country}</span>
              <span className="text-gray-600">College:</span>
              <span>{player.college || "N/A"}</span>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700">Physical Attributes</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-600">Age:</span>
              <span>{player.age || "N/A"}</span>
              <span className="text-gray-600">Height:</span>
              <span>
                {player.playerHeight ? `${player.playerHeight}cm` : "N/A"}
              </span>
              <span className="text-gray-600">Weight:</span>
              <span>
                {player.playerWeight ? `${player.playerWeight}kg` : "N/A"}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700">Draft Information</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-600">Draft Year:</span>
              <span>{player.draftYear || "N/A"}</span>
              <span className="text-gray-600">Draft Round:</span>
              <span>{player.draftRound || "N/A"}</span>
              <span className="text-gray-600">Draft Number:</span>
              <span>{player.draftNumber || "N/A"}</span>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700">Advanced Stats</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-600">Net Rating:</span>
              <span>{player.netRating || "N/A"}</span>
              <span className="text-gray-600">OREB%:</span>
              <span>
                {player.orebPct
                  ? `${(player.orebPct * 100).toFixed(1)}%`
                  : "N/A"}
              </span>
              <span className="text-gray-600">DREB%:</span>
              <span>
                {player.drebPct
                  ? `${(player.drebPct * 100).toFixed(1)}%`
                  : "N/A"}
              </span>
              <span className="text-gray-600">USG%:</span>
              <span>
                {player.usgPct ? `${(player.usgPct * 100).toFixed(1)}%` : "N/A"}
              </span>
              <span className="text-gray-600">TS%:</span>
              <span>
                {player.tsPct ? `${(player.tsPct * 100).toFixed(1)}%` : "N/A"}
              </span>
              <span className="text-gray-600">AST%:</span>
              <span>
                {player.astPct ? `${(player.astPct * 100).toFixed(1)}%` : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
