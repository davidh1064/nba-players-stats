package com.nba.nba_zone.player;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static com.nba.nba_zone.player.PlayerTestData.all;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * The specifications are translated into SQL, so they are exercised against a
 * real database rather than a mock — a predicate that compiles fine can still
 * produce the wrong query.
 *
 * <p>This is the path the {@code GET /api/players} endpoint actually uses.
 */
@DataJpaTest
@ActiveProfiles("test")
class PlayerSpecificationsTest {

    @Autowired
    private PlayerRepository playerRepository;

    @BeforeEach
    void seed() {
        playerRepository.deleteAll();
        playerRepository.saveAll(all());
    }

    private List<String> find(Specification<Player> specification) {
        return playerRepository.findAll(specification).stream()
                .map(Player::getPlayerName)
                .toList();
    }

    @Test
    @DisplayName("hasPlayerName matches a case-insensitive substring")
    void playerNameMatchesSubstring() {
        assertThat(find(PlayerSpecifications.hasPlayerName("lebron")))
                .containsExactly("LeBron James");
    }

    @Test
    @DisplayName("hasPlayerName matches a fragment in the middle of a name")
    void playerNameMatchesMidWord() {
        assertThat(find(PlayerSpecifications.hasPlayerName("ron ja")))
                .containsExactly("LeBron James");
    }

    @Test
    @DisplayName("hasPlayerName returns nothing when there is no match")
    void playerNameNoMatch() {
        assertThat(find(PlayerSpecifications.hasPlayerName("Nobody"))).isEmpty();
    }

    @Test
    @DisplayName("hasTeamName matches a case-insensitive substring of the abbreviation")
    void teamNameMatches() {
        assertThat(find(PlayerSpecifications.hasTeamName("gsw")))
                .containsExactly("Stephen Curry");
    }

    @Test
    @DisplayName("hasSeason requires an exact match")
    void seasonIsExact() {
        assertThat(find(PlayerSpecifications.hasSeason("2022-23")))
                .containsExactlyInAnyOrder("LeBron James", "Stephen Curry");
    }

    @Test
    @DisplayName("hasSeason does not match a partial season string")
    void seasonRejectsPartial() {
        assertThat(find(PlayerSpecifications.hasSeason("2022"))).isEmpty();
    }

    @Test
    @DisplayName("hasCollege matches a case-insensitive substring")
    void collegeMatches() {
        assertThat(find(PlayerSpecifications.hasCollege("duke")))
                .containsExactly("Jayson Tatum");
    }

    @Test
    @DisplayName("hasCountry matches a case-insensitive substring")
    void countryMatches() {
        assertThat(find(PlayerSpecifications.hasCountry("slov")))
                .containsExactly("Luka Doncic");
    }

    @Test
    @DisplayName("A null argument is ignored rather than matching nothing")
    void nullArgumentIsIgnored() {
        // Every filter is optional on the endpoint, so a null must widen the
        // query rather than narrow it to zero rows.
        assertThat(find(PlayerSpecifications.hasPlayerName(null))).hasSize(4);
    }

    @Test
    @DisplayName("Specifications combine with AND")
    void specificationsCombine() {
        Specification<Player> specification = Specification
                .where(PlayerSpecifications.hasCountry("USA"))
                .and(PlayerSpecifications.hasSeason("2022-23"));

        assertThat(find(specification))
                .containsExactlyInAnyOrder("LeBron James", "Stephen Curry");
    }

    @Test
    @DisplayName("Combining with a null filter leaves the other filter intact")
    void combiningWithNullKeepsOtherFilter() {
        Specification<Player> specification = Specification
                .where(PlayerSpecifications.hasPlayerName(null))
                .and(PlayerSpecifications.hasTeamName("BOS"));

        assertThat(find(specification)).containsExactly("Jayson Tatum");
    }

    @Test
    @DisplayName("Contradictory filters return nothing")
    void contradictoryFiltersReturnNothing() {
        Specification<Player> specification = Specification
                .where(PlayerSpecifications.hasTeamName("BOS"))
                .and(PlayerSpecifications.hasCountry("Slovenia"));

        assertThat(find(specification)).isEmpty();
    }
}
