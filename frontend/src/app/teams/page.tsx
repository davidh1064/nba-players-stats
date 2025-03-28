"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { teams } from "@/data/teams";


export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <PageHeader
        title="NBA Teams"
        description="Explore all 30 NBA teams and their players"
      />

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
    </div>
  );
}
