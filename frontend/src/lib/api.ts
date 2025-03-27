import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized) here if needed
    if (error.response?.status === 401) {
      // Handle unauthorized access
    }

    return Promise.reject(error);
  }
);

export default api;

export interface Player {
  id: number;
  name: string;
  team: string;
  season: string;
  college: string;
  country: string;
  stats: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
  };
}

export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export const apiClient = {
  // Player endpoints
  getPlayersByNameAndTeam: async (name: string, team: string) => {
    const response = await api.get<Player[]>(
      `/api/players/search?name=${name}&team=${team}`
    );
    return response.data;
  },

  getPlayersByNameAndSeason: async (name: string, season: string) => {
    const response = await api.get<Player[]>(
      `/api/players/search?name=${name}&season=${season}`
    );
    return response.data;
  },

  getPlayersByName: async (name: string) => {
    const response = await api.get<Player[]>(
      `/api/players/search?name=${name}`
    );
    return response.data;
  },

  getPlayersFromTeam: async (team: string) => {
    const response = await api.get<Player[]>(`/api/players/team/${team}`);
    return response.data;
  },

  getPlayersByCollege: async (college: string) => {
    const response = await api.get<Player[]>(`/api/players/college/${college}`);
    return response.data;
  },

  getPlayersByCountry: async (country: string) => {
    const response = await api.get<Player[]>(`/api/players/country/${country}`);
    return response.data;
  },

  // Team endpoints
  getTeams: async () => {
    const response = await api.get<Team[]>("/api/teams");
    return response.data;
  },

  // Country endpoints
  getCountries: async () => {
    const response = await api.get<Country[]>("/api/countries");
    return response.data;
  },
};
