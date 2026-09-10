package com.nba.nba_zone.player;

import java.util.List;

/**
 * Shared fixtures for the player tests.
 *
 * <p>The four players are chosen so that every filter dimension has both a match
 * and a non-match: two seasons, four teams, two players with a college and two
 * without, and two countries.
 */
final class PlayerTestData {

    private PlayerTestData() {
    }

    static Player player(Long id, String name, String team, String season, String college, String country) {
        Player player = new Player();
        player.setId(id);
        player.setPlayerName(name);
        player.setTeamAbbreviation(team);
        player.setSeason(season);
        player.setCollege(college);
        player.setCountry(country);
        return player;
    }

    static Player lebron() {
        return player(1L, "LeBron James", "LAL", "2022-23", "None", "USA");
    }

    static Player curry() {
        return player(2L, "Stephen Curry", "GSW", "2022-23", "Davidson", "USA");
    }

    static Player doncic() {
        return player(3L, "Luka Doncic", "DAL", "2023-24", "None", "Slovenia");
    }

    static Player tatum() {
        return player(4L, "Jayson Tatum", "BOS", "2023-24", "Duke", "USA");
    }

    static List<Player> all() {
        return List.of(lebron(), curry(), doncic(), tatum());
    }
}
