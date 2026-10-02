package com.nba.nba_zone.player;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static com.nba.nba_zone.player.PlayerTestData.all;
import static com.nba.nba_zone.player.PlayerTestData.curry;
import static com.nba.nba_zone.player.PlayerTestData.lebron;
import static com.nba.nba_zone.player.PlayerTestData.player;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Behaviour of {@link PlayerService}, with the repository mocked.
 *
 * <p>Most of the filter methods pull the whole table with {@code findAll()} and
 * filter in memory, so mocking the repository exercises the real filter logic.
 */
@ExtendWith(MockitoExtension.class)
class PlayerServiceTest {

    @Mock
    private PlayerRepository playerRepository;

    @InjectMocks
    private PlayerService playerService;

    private void repositoryReturnsAll() {
        when(playerRepository.findAll()).thenReturn(all());
    }

    private static List<String> namesOf(List<Player> players) {
        return players.stream().map(Player::getPlayerName).toList();
    }

    @Nested
    @DisplayName("Basic reads")
    class BasicReads {

        @Test
        @DisplayName("getPlayers returns everything the repository holds")
        void getPlayersReturnsAll() {
            repositoryReturnsAll();

            assertThat(playerService.getPlayers()).hasSize(4);
        }

        @Test
        @DisplayName("getPlayerById returns the player when present")
        void getPlayerByIdFound() {
            when(playerRepository.findById(1L)).thenReturn(Optional.of(lebron()));

            assertThat(playerService.getPlayerById(1L).getPlayerName()).isEqualTo("LeBron James");
        }

        @Test
        @DisplayName("getPlayerById returns null when absent")
        void getPlayerByIdMissing() {
            when(playerRepository.findById(99L)).thenReturn(Optional.empty());

            assertThat(playerService.getPlayerById(99L)).isNull();
        }
    }

    @Nested
    @DisplayName("Single-field filters")
    class SingleField {

        @Test
        @DisplayName("getPlayersByTeam matches on a substring of the abbreviation")
        void byTeam() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByTeam("LAL")))
                    .containsExactly("LeBron James");
        }

        @Test
        @DisplayName("getPlayersByTeam is case-insensitive")
        void byTeamIgnoresCase() {
            repositoryReturnsAll();

            assertThat(playerService.getPlayersByTeam("lal")).hasSize(1);
        }

        @Test
        @DisplayName("getPlayersByTeam matches a partial abbreviation")
        void byTeamMatchesPartial() {
            repositoryReturnsAll();

            // "A" appears in LAL and DAL, but not GSW or BOS.
            assertThat(namesOf(playerService.getPlayersByTeam("A")))
                    .containsExactlyInAnyOrder("LeBron James", "Luka Doncic");
        }

        @Test
        @DisplayName("getPlayersByName matches on a substring of the name")
        void byName() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByName("curry")))
                    .containsExactly("Stephen Curry");
        }

        @Test
        @DisplayName("getPlayersByName returns empty when nothing matches")
        void byNameNoMatch() {
            repositoryReturnsAll();

            assertThat(playerService.getPlayersByName("Nobody")).isEmpty();
        }

        @Test
        @DisplayName("getPlayersByCollege matches on a substring")
        void byCollege() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByCollege("duke")))
                    .containsExactly("Jayson Tatum");
        }

        @Test
        @DisplayName("getPlayersByCountry matches on a substring")
        void byCountry() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByCountry("Slovenia")))
                    .containsExactly("Luka Doncic");
        }

        @Test
        @DisplayName("getPlayersBySeason requires an exact season match")
        void bySeason() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersBySeason("2022-23")))
                    .containsExactlyInAnyOrder("LeBron James", "Stephen Curry");
        }

        @Test
        @DisplayName("getPlayersBySeason does not match a partial season")
        void bySeasonIsNotSubstring() {
            repositoryReturnsAll();

            // Unlike the other filters, season uses equals() rather than contains().
            assertThat(playerService.getPlayersBySeason("2022")).isEmpty();
        }
    }

    @Nested
    @DisplayName("Two-field filters")
    class TwoField {

        @Test
        @DisplayName("getPlayersByNameAndTeam")
        void nameAndTeam() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByNameAndTeam("LeBron", "LAL")))
                    .containsExactly("LeBron James");
        }

        @Test
        @DisplayName("getPlayersByNameAndTeam requires an exact team abbreviation")
        void nameAndTeamNeedsExactTeam() {
            repositoryReturnsAll();

            // This method compares the team with equals(), unlike getPlayersByTeam.
            assertThat(playerService.getPlayersByNameAndTeam("LeBron", "lal")).isEmpty();
        }

        @Test
        @DisplayName("getPlayersByNameAndSeason")
        void nameAndSeason() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByNameAndSeason("Curry", "2022-23")))
                    .containsExactly("Stephen Curry");
        }

        @Test
        @DisplayName("getPlayersByNameAndCountry")
        void nameAndCountry() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByNameAndCountry("Luka", "Slovenia")))
                    .containsExactly("Luka Doncic");
        }

        @Test
        @DisplayName("getPlayersByNameAndCollege")
        void nameAndCollege() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByNameAndCollege("Tatum", "Duke")))
                    .containsExactly("Jayson Tatum");
        }

        @Test
        @DisplayName("getPlayersByTeamAndSeason")
        void teamAndSeason() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByTeamAndSeason("GSW", "2022-23")))
                    .containsExactly("Stephen Curry");
        }

        @Test
        @DisplayName("getPlayersByTeamAndCollege")
        void teamAndCollege() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByTeamAndCollege("BOS", "Duke")))
                    .containsExactly("Jayson Tatum");
        }

        @Test
        @DisplayName("getPlayersByTeamAndCountry")
        void teamAndCountry() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByTeamAndCountry("DAL", "Slovenia")))
                    .containsExactly("Luka Doncic");
        }

        @Test
        @DisplayName("getPlayersBySeasonAndCollege")
        void seasonAndCollege() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersBySeasonAndCollege("2022-23", "Davidson")))
                    .containsExactly("Stephen Curry");
        }

        @Test
        @DisplayName("getPlayersBySeasonAndCountry")
        void seasonAndCountry() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersBySeasonAndCountry("2023-24", "USA")))
                    .containsExactly("Jayson Tatum");
        }

        @Test
        @DisplayName("getPlayersByCollegeAndCountry")
        void collegeAndCountry() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByCollegeAndCountry("Davidson", "USA")))
                    .containsExactly("Stephen Curry");
        }
    }

    @Nested
    @DisplayName("Three-field filters")
    class ThreeField {

        @Test
        @DisplayName("getPlayersByNameTeamAndSeason")
        void nameTeamSeason() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByNameTeamAndSeason("LeBron", "lal", "2022-23")))
                    .containsExactly("LeBron James");
        }

        @Test
        @DisplayName("getPlayersByNameTeamAndCollege")
        void nameTeamCollege() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByNameTeamAndCollege("Tatum", "BOS", "Duke")))
                    .containsExactly("Jayson Tatum");
        }

        @Test
        @DisplayName("getPlayersByNameTeamAndCountry")
        void nameTeamCountry() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByNameTeamAndCountry("Luka", "DAL", "Slovenia")))
                    .containsExactly("Luka Doncic");
        }

        @Test
        @DisplayName("getPlayersByNameSeasonAndCollege")
        void nameSeasonCollege() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByNameSeasonAndCollege("Curry", "2022-23", "Davidson")))
                    .containsExactly("Stephen Curry");
        }

        @Test
        @DisplayName("getPlayersByNameSeasonAndCountry")
        void nameSeasonCountry() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByNameSeasonAndCountry("Tatum", "2023-24", "USA")))
                    .containsExactly("Jayson Tatum");
        }

        @Test
        @DisplayName("getPlayersByNameCollegeAndCountry")
        void nameCollegeCountry() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByNameCollegeAndCountry("Curry", "Davidson", "USA")))
                    .containsExactly("Stephen Curry");
        }

        @Test
        @DisplayName("getPlayersByTeamSeasonAndCollege")
        void teamSeasonCollege() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByTeamSeasonAndCollege("BOS", "2023-24", "Duke")))
                    .containsExactly("Jayson Tatum");
        }

        @Test
        @DisplayName("getPlayersByTeamSeasonAndCountry")
        void teamSeasonCountry() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByTeamSeasonAndCountry("DAL", "2023-24", "Slovenia")))
                    .containsExactly("Luka Doncic");
        }

        @Test
        @DisplayName("getPlayersByTeamCollegeAndCountry")
        void teamCollegeCountry() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByTeamCollegeAndCountry("GSW", "Davidson", "USA")))
                    .containsExactly("Stephen Curry");
        }

        @Test
        @DisplayName("getPlayersBySeasonCollegeAndCountry")
        void seasonCollegeCountry() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersBySeasonCollegeAndCountry("2023-24", "Duke", "USA")))
                    .containsExactly("Jayson Tatum");
        }
    }

    @Nested
    @DisplayName("Four- and five-field filters")
    class WideFilters {

        @Test
        @DisplayName("getPlayersByNameTeamSeasonAndCollege")
        void nameTeamSeasonCollege() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByNameTeamSeasonAndCollege(
                    "Tatum", "BOS", "2023-24", "Duke")))
                    .containsExactly("Jayson Tatum");
        }

        @Test
        @DisplayName("getPlayersByNameTeamSeasonAndCountry")
        void nameTeamSeasonCountry() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByNameTeamSeasonAndCountry(
                    "Luka", "DAL", "2023-24", "Slovenia")))
                    .containsExactly("Luka Doncic");
        }

        @Test
        @DisplayName("getPlayersByNameTeamCollegeAndCountry")
        void nameTeamCollegeCountry() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByNameTeamCollegeAndCountry(
                    "Curry", "GSW", "Davidson", "USA")))
                    .containsExactly("Stephen Curry");
        }

        @Test
        @DisplayName("getPlayersByNameSeasonCollegeAndCountry")
        void nameSeasonCollegeCountry() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByNameSeasonCollegeAndCountry(
                    "Tatum", "2023-24", "Duke", "USA")))
                    .containsExactly("Jayson Tatum");
        }

        @Test
        @DisplayName("getPlayersByTeamSeasonCollegeAndCountry")
        void teamSeasonCollegeCountry() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByTeamSeasonCollegeAndCountry(
                    "GSW", "2022-23", "Davidson", "USA")))
                    .containsExactly("Stephen Curry");
        }

        @Test
        @DisplayName("getPlayersByAllFields matches on every dimension at once")
        void allFields() {
            repositoryReturnsAll();

            assertThat(namesOf(playerService.getPlayersByAllFields(
                    "Tatum", "BOS", "2023-24", "Duke", "USA")))
                    .containsExactly("Jayson Tatum");
        }

        @Test
        @DisplayName("getPlayersByAllFields returns empty when one field disagrees")
        void allFieldsRejectsMismatch() {
            repositoryReturnsAll();

            assertThat(playerService.getPlayersByAllFields(
                    "Tatum", "BOS", "2022-23", "Duke", "USA")).isEmpty();
        }
    }

    @Nested
    @DisplayName("filterPlayers (the endpoint's actual query path)")
    class FilterPlayers {

        @Test
        @DisplayName("delegates to the repository with a specification")
        void delegatesToSpecification() {
            when(playerRepository.findAll(any(Specification.class))).thenReturn(List.of(curry()));

            assertThat(namesOf(playerService.filterPlayers("Curry", null, null, null, null)))
                    .containsExactly("Stephen Curry");
        }

        @Test
        @DisplayName("all-null arguments still produce a query rather than failing")
        void allNullArguments() {
            when(playerRepository.findAll(any(Specification.class))).thenReturn(all());

            assertThat(playerService.filterPlayers(null, null, null, null, null)).hasSize(4);
        }
    }

    @Nested
    @DisplayName("Writes")
    class Writes {

        @Test
        @DisplayName("addPlayer saves and returns the player")
        void addPlayer() {
            Player toSave = lebron();
            when(playerRepository.save(toSave)).thenReturn(toSave);

            assertThat(playerService.addPlayer(toSave).getPlayerName()).isEqualTo("LeBron James");
            verify(playerRepository).save(toSave);
        }

        @Test
        @DisplayName("updatePlayer copies the incoming fields onto the stored player")
        void updatePlayerCopiesFields() {
            Player existing = lebron();
            Player incoming = player(1L, "Renamed", "BOS", "2023-24", "Duke", "Canada");
            when(playerRepository.findPlayerById(1L)).thenReturn(Optional.of(existing));
            when(playerRepository.save(any(Player.class))).thenAnswer(call -> call.getArgument(0));

            Player updated = playerService.updatePlayer(1L, incoming);

            assertThat(updated.getPlayerName()).isEqualTo("Renamed");
            assertThat(updated.getTeamAbbreviation()).isEqualTo("BOS");
            assertThat(updated.getSeason()).isEqualTo("2023-24");
            assertThat(updated.getCollege()).isEqualTo("Duke");
            assertThat(updated.getCountry()).isEqualTo("Canada");
        }

        @Test
        @DisplayName("updatePlayer keeps the original id, not the one in the body")
        void updatePlayerKeepsOriginalId() {
            Player existing = lebron();
            Player incoming = player(999L, "Renamed", "BOS", "2023-24", "Duke", "USA");
            when(playerRepository.findPlayerById(1L)).thenReturn(Optional.of(existing));
            when(playerRepository.save(any(Player.class))).thenAnswer(call -> call.getArgument(0));

            assertThat(playerService.updatePlayer(1L, incoming).getId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("updatePlayer raises 404 for a missing player")
        void updateMissingPlayer() {
            when(playerRepository.findPlayerById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> playerService.updatePlayer(99L, lebron()))
                    .isInstanceOf(ResponseStatusException.class)
                    .hasMessageContaining("404");

            verify(playerRepository, never()).save(any());
        }

        @Test
        @DisplayName("deletePlayer removes an existing player")
        void deleteExistingPlayer() {
            when(playerRepository.existsById(1L)).thenReturn(true);

            playerService.deletePlayer(1L);

            verify(playerRepository).deletePlayerById(1L);
        }

        @Test
        @DisplayName("deletePlayer raises 404 for a missing player instead of silently succeeding")
        void deleteMissingPlayer() {
            when(playerRepository.existsById(99L)).thenReturn(false);

            assertThatThrownBy(() -> playerService.deletePlayer(99L))
                    .isInstanceOf(ResponseStatusException.class)
                    .hasMessageContaining("404");

            verify(playerRepository, never()).deletePlayerById(any());
        }
    }
}
