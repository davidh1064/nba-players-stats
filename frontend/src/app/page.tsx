"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen py-12 sm:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <div className="relative w-32 h-32 mx-auto mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute inset-0 bg-blue-600 rounded-full opacity-20 blur-2xl"
              />
              <Image
                src="/nba-logo.png"
                alt="NBA Logo"
                width={128}
                height={128}
                className="relative z-10"
                priority
              />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight"
            >
              NBA Zone
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto"
            >
              Your Ultimate Destination for NBA Players' Statistics and Analysis
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="pt-8"
            >
              <Link href="/teams">
                <button className="group relative px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-blue-600 text-2xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Player Stats
              </h3>
              <p className="text-gray-600">
                Comprehensive statistics for every NBA player
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-blue-600 text-2xl mb-4">🏀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Draft Insights
              </h3>
              <p className="text-gray-600">
                Explore draft years, rounds, and picks of NBA players
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-blue-600 text-2xl mb-4">🌍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Global View
              </h3>
              <p className="text-gray-600">
                International player statistics and trends
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
