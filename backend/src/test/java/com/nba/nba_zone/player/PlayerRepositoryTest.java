package com.nba.nba_zone.player;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static com.nba.nba_zone.player.PlayerTestData.all;
import static com.nba.nba_zone.player.PlayerTestData.player;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * The derived query methods on {@link PlayerRepository}. Spring Data generates
 * their implementations from the method names, so the only way to know they do
 * what the name claims is to run them.
 */
@DataJpaTest
@ActiveProfiles("test")
class PlayerRepositoryTest {

    @Autowired
    private PlayerRepository playerRepository;

    @BeforeEach
    void seed() {
        playerRepository.deleteAll();
        playerRepository.saveAll(all());
    }

    @Test
    @DisplayName("findPlayerById returns the matching player")
    void findPlayerByIdFound() {
        Optional<Player> found = playerRepository.findPlayerById(2L);

        assertThat(found).isPresent();
        assertThat(found.get().getPlayerName()).isEqualTo("Stephen Curry");
    }

    @Test
    @DisplayName("findPlayerById returns empty for an unknown id")
    void findPlayerByIdMissing() {
        assertThat(playerRepository.findPlayerById(999L)).isEmpty();
    }

    @Test
    @DisplayName("deletePlayerById removes only the named player")
    void deletePlayerByIdRemovesOne() {
        playerRepository.deletePlayerById(1L);

        assertThat(playerRepository.findById(1L)).isEmpty();
        assertThat(playerRepository.findAll()).hasSize(3);
    }

    @Test
    @DisplayName("deletePlayerById is a no-op for an unknown id")
    void deleteUnknownIdIsNoOp() {
        playerRepository.deletePlayerById(999L);

        assertThat(playerRepository.findAll()).hasSize(4);
    }

    @Test
    @DisplayName("save persists a new player with its assigned id")
    void saveAssignsGivenId() {
        // The entity uses an assigned identifier, not a generated one, so the
        // id supplied by the caller is the one that is stored.
        playerRepository.save(player(500L, "New Player", "MIA", "2024-25", "UNC", "USA"));

        assertThat(playerRepository.findById(500L)).isPresent();
        assertThat(playerRepository.findAll()).hasSize(5);
    }

    @Test
    @DisplayName("save on an existing id updates rather than inserting")
    void saveExistingIdUpdates() {
        playerRepository.save(player(1L, "Changed", "MIA", "2024-25", "UNC", "USA"));

        assertThat(playerRepository.findAll()).hasSize(4);
        assertThat(playerRepository.findById(1L).orElseThrow().getPlayerName()).isEqualTo("Changed");
    }

    @Test
    @DisplayName("existsById reflects presence and absence")
    void existsById() {
        assertThat(playerRepository.existsById(1L)).isTrue();
        assertThat(playerRepository.existsById(999L)).isFalse();
    }
}
