package com.nba.nba_zone.player;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        if (playerName != null && teamName != null) {
            return playerService.getPlayersByNameAndTeam(playerName, teamName);
        }
        else if (playerName != null && season != null) {
            return playerService.getPlayersByNameAndSeason(playerName, season);
        }
        else if (playerName != null) {
            return playerService.getPlayersByName(playerName);
        }
        else if (teamName != null) {
            return playerService.getPlayersFromTeam(teamName);
        }
        else if (college != null) {
            return playerService.getPlayersByCollege(college);
        }
        else if (country != null) {
            return playerService.getPlayersByCountry(country);
        }
        else {
            return playerService.getPlayers();
        }
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
