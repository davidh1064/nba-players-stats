"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { teams } from "@/data/teams";
import { playerService } from "@/lib/services/playerService";
import { usePlayerData } from "@/hooks/usePlayerData";
import PlayerStatsTable from "@/components/tables/PlayerStatsTable";
import PlayerDetailsModal from "@/components/modals/PlayerDetailsModal";
import { teamNameToAbbreviation } from "@/lib/constants/teamAbbreviations";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";
import BackButton from "@/components/ui/BackButton";

export default function TeamsPage() {
  const router = useRouter();
  const urlParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const {
    players,
    isLoading,
    selectedPlayer,
    isModalOpen,
    setIsLoading,
    handlePlayerClick,
    handleModalClose,
    handleError,
    handleSuccess,
  } = usePlayerData();

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTeamClick = async (teamName: string) => {
    try {
      const teamAbbreviation = teamNameToAbbreviation[teamName];

      setIsLoading(true);
      setSelectedTeam(teamName);

      const queryParams = new URLSearchParams({ teamAbbreviation });
      const newUrl = `/teams?${queryParams.toString()}`;
      router.push(newUrl);

      const results = await playerService.getPlayersByTeam(teamAbbreviation);

      if (results.length === 0) {
        toast.info("No players found for this season");
      }
      handleSuccess(results);
    } catch (error) {
      handleError(error, "Failed to fetch players from this team.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <PageHeader
        title="NBA Teams"
        description="Explore all 30 NBA teams and their players"
      />

      {!selectedTeam && (
        <>
          <div className="relative max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-lg peer relative z-20"
                placeholder=" "
              />
              <label className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600 bg-white px-1 z-30 pointer-events-none">
                Search for teams...
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border cursor-pointer overflow-hidden"
                onClick={() => handleTeamClick(`${team.city} ${team.name}`)}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={team.logo}
                    alt={`${team.city} ${team.name} logo`}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {team.city}
                  </h3>
                  <p className="text-gray-600">{team.name}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedTeam && (
        <div className="space-y-6">
          <BackButton
            onClick={() => {
              setSelectedTeam(null);
              router.replace("/teams");
            }}
            label="Back to Teams"
          />
          <PlayerStatsTable
            players={players}
            title={`${selectedTeam} Player Stats`}
            onPlayerClick={handlePlayerClick}
          />
        </div>
      )}

      <PlayerDetailsModal
        player={selectedPlayer}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
