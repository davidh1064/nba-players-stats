import api from "../api";

export interface Player {
  id: number;
  name: string; // Maps to `playerName`
  team: string; // Maps to `teamAbbreviation`
  season: string;
  college?: string;
  country: string;
  age?: number;
  playerHeight?: number;
  playerWeight?: number;
  draftYear?: string;
  draftRound?: string;
  draftNumber?: string;
  gp?: number; // Games Played
  pts?: number; // Points Per Game
  reb?: number; // Rebounds Per Game
  ast?: number; // Assists Per Game
  netRating?: number;
  orebPct?: number; // Offensive Rebound Percentage
  drebPct?: number; // Defensive Rebound Percentage
  usgPct?: number; // Usage Percentage
  tsPct?: number; // True Shooting Percentage
  astPct?: number; // Assist Percentage
}

export interface PlayerSearchParams {
  playerName?: string;
  teamName?: string;
  season?: string;
  college?: string;
  country?: string;
}

export const playerService = {
  // Get all players with optional filters
  getPlayers: async (params?: PlayerSearchParams) => {
    try {
      const response = await api.get<Player[]>("/players", { params });
      
      const mappedPlayers: Player[] = response.data.map((p: any) => ({
        ...p,
        name: p.playerName,
        team: p.teamAbbreviation
      }));

      return mappedPlayers;
    } catch (error) {
      console.error("Error fetching players:", error);
      throw error;
    }
  },

  // Get a single player by ID
  getPlayerById: async (id: number) => {
    try {
      const response = await api.get<Player>(`/players/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching player:", error);
      throw error;
    }
  },

  // Add a new player
  createPlayer: async (player: Omit<Player, "id">) => {
    try {
      const response = await api.post<Player>("/players", player);
      return response.data;
    } catch (error) {
      console.error("Error creating player:", error);
      throw error;
    }
  },

  // Update an existing player
  updatePlayer: async (player: Player) => {
    try {
      const response = await api.put<Player>("/players", player);
      return response.data;
    } catch (error) {
      console.error("Error updating player:", error);
      throw error;
    }
  },

  // Delete a player
  deletePlayer: async (id: number) => {
    try {
      await api.delete(`/players/${id}`);
    } catch (error) {
      console.error("Error deleting player:", error);
      throw error;
    }
  },
};
