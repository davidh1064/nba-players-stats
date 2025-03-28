import { useState } from "react";
import { Player } from "@/lib/services/playerService";
import { toast } from "sonner";

interface UsePlayerDataProps {
  onSuccess?: (data: Player[]) => void;
  onError?: (error: unknown) => void;
}

export function usePlayerData({ onSuccess, onError }: UsePlayerDataProps = {}) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
  };

  const handleError = (error: unknown, message: string) => {
    console.error(message, error);
    toast.error(message);
    onError?.(error);
  };

  const handleSuccess = (data: Player[]) => {
    setPlayers(data);
    onSuccess?.(data);
  };

  return {
    players,
    isLoading,
    selectedPlayer,
    isModalOpen,
    setIsLoading,
    handlePlayerClick,
    handleModalClose,
    handleError,
    handleSuccess,
  };
}
