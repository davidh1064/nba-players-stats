package com.nba.nba_zone.player;

/**
 * One row of the countries overview: a country as spelled in the dataset, and
 * how many distinct players come from it.
 *
 * @param country     the dataset's own country string (e.g. "USA", "Slovenia"),
 *                    used verbatim so it can be passed back to
 *                    {@code GET /api/players?country=...}
 * @param playerCount distinct player names, not player-season rows
 */
public record CountryPlayerCount(String country, long playerCount) {
}
