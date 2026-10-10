package com.nba.nba_zone.player;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long>, JpaSpecificationExecutor<Player> {
    void deletePlayerById(Long id);

    Optional<Player> findPlayerById(Long id);

    /**
     * Distinct players per country, largest first. Tie order is NOT guaranteed
     * here: it would depend on the database's collation (C vs en_US.UTF-8 order
     * names differently). PlayerService applies the deterministic final order.
     *
     * <p>Why one aggregate query: the Countries page used to fetch every
     * country from a third-party API and then call the backend once per
     * country (~250 requests) just to count rows. The database already knows
     * every player's country.
     *
     * <p>Why COUNT(DISTINCT playerName): each row is a player-season, so a
     * plain COUNT would count a 20-season veteran 20 times. The dataset has no
     * stable player id, so the name is the only identity available; two
     * different players who share a name are counted once. Rows with a null or
     * blank country are excluded.
     */
    @Query("""
            SELECT new com.nba.nba_zone.player.CountryPlayerCount(p.country, COUNT(DISTINCT p.playerName))
            FROM Player p
            WHERE p.country IS NOT NULL AND TRIM(p.country) <> ''
            GROUP BY p.country
            ORDER BY COUNT(DISTINCT p.playerName) DESC
            """)
    List<CountryPlayerCount> countPlayersByCountry();
}
