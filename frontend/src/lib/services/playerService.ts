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
  // Fetch all players with optional filters
  getPlayers: async (params?: PlayerSearchParams) => {
    try {
      const response = await api.get<Player[]>("/players", { params });

      const mappedPlayers: Player[] = response.data.map((p: any) => ({
        ...p,
        name: p.playerName,
        team: p.teamAbbreviation,
      }));

      return mappedPlayers;
    } catch (error) {
      console.error("Error fetching players:", error);
      throw error;
    }
  },

  // Fetch single player by ID
  getPlayerById: async (id: number) => {
    const response = await api.get<Player>(`/players/${id}`);
    return response.data;
  },

  // Create new player
  createPlayer: async (player: Omit<Player, "id">) => {
    const response = await api.post<Player>("/players", player);
    return response.data;
  },

  // Update existing player
  updatePlayer: async (player: Player) => {
    const response = await api.put<Player>("/players", player);
    return response.data;
  },

  // Delete player
  deletePlayer: async (id: number) => {
    await api.delete(`/players/${id}`);
  },

  // Fetch players by team
  getPlayersByTeam: async (teamAbbreviation: string) => {
    try {
      const response = await api.get<Player[]>("/players", {
        params: { teamName: teamAbbreviation },
      });
      const mappedPlayers: Player[] = response.data.map((p: any) => ({
        ...p,
        name: p.playerName,
        team: p.teamAbbreviation,
      }));

      return mappedPlayers;
    } catch (error) {
      console.error("Error fetching players by team:", error);
      throw error;
    }
  },

  //   // Fetch players by country
  getPlayersByCountry: async (country: string) => {
    try {
      const response = await api.get<Player[]>("/players", {
        params: { country },
      });

      const mappedPlayers: Player[] = response.data.map((p: any) => ({
        ...p,
        name: p.playerName,
        team: p.teamAbbreviation,
      }));

      return mappedPlayers;
    } catch (error) {
      console.error("Error fetching players by country:", error);
      throw error;
    }
  },

    //   // Fetch players by countries
    getPlayersBySeason: async (season: string) => {
      try {
        const response = await api.get<Player[]>("/players", {
          params: { season },
        });
  
        const mappedPlayers: Player[] = response.data.map((p: any) => ({
          ...p,
          name: p.playerName,
          team: p.teamAbbreviation,
        }));
  
        return mappedPlayers;
      } catch (error) {
        console.error("Error fetching players by season:", error);
        throw error;
      }
    },
};
