package com.nba.nba_zone.player;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerService playerService;

    @Autowired
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
        return new ResponseEntity<>(playerService.getPlayerById(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Player> addPlayer(@RequestBody Player player) {
        Player createdPlayer = playerService.addPlayer(player);
        return new ResponseEntity<>(createdPlayer, HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<Player> updatePlayer(@RequestBody Player player) {
        Player updatedPlayer = playerService.updatePlayer(player.getId(), player);
        return new ResponseEntity<>(updatedPlayer, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
        return new ResponseEntity<>("Player deleted successfully", HttpStatus.OK);
    }

}
