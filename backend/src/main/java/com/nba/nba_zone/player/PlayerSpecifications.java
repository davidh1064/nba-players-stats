package com.nba.nba_zone.player;
import org.springframework.data.jpa.domain.Specification;


public class PlayerSpecifications {
    public static Specification<Player> hasPlayerName(String playerName) {
        return (root, query, cb) -> playerName == null ? null :
                cb.like(cb.lower(root.get("playerName")), "%" + playerName.toLowerCase() + "%");
    }

    public static Specification<Player> hasTeamName(String teamName) {
        return (root, query, cb) -> teamName == null ? null :
                cb.like(cb.lower(root.get("teamAbbreviation")), "%" + teamName.toLowerCase() + "%");
    }

    public static Specification<Player> hasSeason(String season) {
        return (root, query, cb) -> season == null ? null :
                cb.equal(cb.lower(root.get("season")), season.toLowerCase());
    }

    public static Specification<Player> hasCollege(String college) {
        return (root, query, cb) -> college == null ? null :
                cb.like(cb.lower(root.get("college")), "%" + college.toLowerCase() + "%");
    }

    public static Specification<Player> hasCountry(String country) {
        return (root, query, cb) -> country == null ? null :
                cb.like(cb.lower(root.get("country")), "%" + country.toLowerCase() + "%");
    }
}
