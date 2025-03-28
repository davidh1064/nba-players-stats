import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Users, Trophy, Globe, Calendar } from "lucide-react";
import StatCard from "@/components/ui/StatCard";

export default function HomePage() {
  const stats = [
    {
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      value: "500+",
      label: "Active Players",
    },
    {
      icon: Trophy,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      value: "30",
      label: "NBA Teams",
    },
    {
      icon: Globe,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      value: "40+",
      label: "Countries",
    },
    {
      icon: Calendar,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      value: "27",
      label: "Seasons",
    },
  ];

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-8">
      <div className="relative w-48 h-48 mb-12 animate-fade-in">
        <Image
          src="/nba-logo.png"
          alt="NBA Logo"
          fill
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>

      <h1 className="text-5xl font-bold text-center mb-6 max-w-3xl leading-tight animate-fade-in-up">
        Your home for every NBA player's stats from 1996 to 2022 season
      </h1>

      <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl animate-fade-in-up">
        Discover comprehensive statistics, analyze player performance, and
        explore the rich history of the NBA
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 w-full max-w-5xl animate-fade-in-up">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
            value={stat.value}
            label={stat.label}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
        <Link href="/teams">
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </Button>
        </Link>
        <Link href="/players/search">
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 border-2 hover:bg-gray-50 transition-all duration-300"
          >
            Search Players
          </Button>
        </Link>
      </div>
    </main>
  );
}
