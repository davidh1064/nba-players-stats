package com.nba.nba_zone.player;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Reads are public. Writes require the admin role, enforced centrally in
 * {@link com.nba.nba_zone.config.SecurityConfig}.
 *
 * <p>The class-level {@code @CrossOrigin} annotation that used to live here was
 * removed: allowed origins are now configuration-driven, and CORS was never an
 * access control to begin with.
 */
@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping
    public List<Player> getPlayers(
            @RequestParam(required = false) String playerName,
            @RequestParam(required = false) String teamName,
            @RequestParam(required = false) String college,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String season
    ) {
        return playerService.filterPlayers(playerName, teamName, season, college, country);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable Long id) {
        Player player = playerService.getPlayerById(id);
        if (player == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Player " + id + " not found");
        }
        return ResponseEntity.ok(player);
    }

    @PostMapping
    public ResponseEntity<Player> addPlayer(@RequestBody Player player) {
        Player createdPlayer = playerService.addPlayer(player);
        return new ResponseEntity<>(createdPlayer, HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<Player> updatePlayer(@RequestBody Player player) {
        if (player.getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Player id is required");
        }
        return ResponseEntity.ok(playerService.updatePlayer(player.getId(), player));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
        return ResponseEntity.noContent().build();
    }

}
