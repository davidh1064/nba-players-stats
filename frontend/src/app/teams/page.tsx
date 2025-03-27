"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Team {
  id: number;
  name: string;
  logo: string;
  city: string;
}

const teams: Team[] = [
  { id: 1, name: "Hawks", logo: "/team-logos/hawks.svg", city: "Atlanta" },
  { id: 2, name: "Celtics", logo: "/team-logos/celtics.svg", city: "Boston" },
  { id: 3, name: "Nets", logo: "/team-logos/nets.svg", city: "Brooklyn" },
  {
    id: 4,
    name: "Hornets",
    logo: "/team-logos/hornets.svg",
    city: "Charlotte",
  },
  { id: 5, name: "Bulls", logo: "/team-logos/bulls.svg", city: "Chicago" },
  {
    id: 6,
    name: "Cavaliers",
    logo: "/team-logos/cavaliers.svg",
    city: "Cleveland",
  },
  {
    id: 7,
    name: "Mavericks",
    logo: "/team-logos/mavericks.svg",
    city: "Dallas",
  },
  { id: 8, name: "Nuggets", logo: "/team-logos/nuggets.svg", city: "Denver" },
  { id: 9, name: "Pistons", logo: "/team-logos/pistons.svg", city: "Detroit" },
  {
    id: 10,
    name: "Warriors",
    logo: "/team-logos/warriors.svg",
    city: "Golden State",
  },
  { id: 11, name: "Rockets", logo: "/team-logos/rockets.svg", city: "Houston" },
  { id: 12, name: "Pacers", logo: "/team-logos/pacers.svg", city: "Indiana" },
  { id: 13, name: "Clippers", logo: "/team-logos/clippers.svg", city: "LA" },
  { id: 14, name: "Lakers", logo: "/team-logos/lakers.svg", city: "LA" },
  {
    id: 15,
    name: "Grizzlies",
    logo: "/team-logos/grizzlies.svg",
    city: "Memphis",
  },
  { id: 16, name: "Heat", logo: "/team-logos/heat.svg", city: "Miami" },
  { id: 17, name: "Bucks", logo: "/team-logos/bucks.svg", city: "Milwaukee" },
  {
    id: 18,
    name: "Timberwolves",
    logo: "/team-logos/timberwolves.svg",
    city: "Minnesota",
  },
  {
    id: 19,
    name: "Pelicans",
    logo: "/team-logos/pelicans.svg",
    city: "New Orleans",
  },
  { id: 20, name: "Knicks", logo: "/team-logos/knicks.svg", city: "New York" },
  {
    id: 21,
    name: "Thunder",
    logo: "/team-logos/thunder.svg",
    city: "Oklahoma City",
  },
  { id: 22, name: "Magic", logo: "/team-logos/magic.svg", city: "Orlando" },
  {
    id: 23,
    name: "76ers",
    logo: "/team-logos/76ers.svg",
    city: "Philadelphia",
  },
  { id: 24, name: "Suns", logo: "/team-logos/suns.svg", city: "Phoenix" },
  {
    id: 25,
    name: "Trail Blazers",
    logo: "/team-logos/blazers.svg",
    city: "Portland",
  },
  { id: 26, name: "Kings", logo: "/team-logos/kings.svg", city: "Sacramento" },
  { id: 27, name: "Spurs", logo: "/team-logos/spurs.svg", city: "San Antonio" },
  { id: 28, name: "Raptors", logo: "/team-logos/raptors.svg", city: "Toronto" },
  { id: 29, name: "Jazz", logo: "/team-logos/jazz.svg", city: "Utah" },
  {
    id: 30,
    name: "Wizards",
    logo: "/team-logos/wizards.svg",
    city: "Washington",
  },
];

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">NBA Teams</h1>
        <p className="text-lg text-gray-600">
          Explore all 30 NBA teams and their players
        </p>
      </div>

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
