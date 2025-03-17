package com.nba.nba_zone.player;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PlayerService {
    private final PlayerRepository playerRepository;

    @Autowired
    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public List<Player> getPlayers() {
        return playerRepository.findAll();
    }

    public Player getPlayerById(Long id) {
        return playerRepository.findById(id).orElse(null);
    }

    public List<Player> getPlayersFromTeam(String teamName) {
        return playerRepository.findAll().stream()
                .filter(player -> teamName.equals(player.getTeamAbbreviation()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByName(String searchText) {
        return playerRepository.findAll().stream()
                .filter(player -> player.getPlayerName().toLowerCase().contains(searchText.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByNameAndTeam(String playerName, String teamName) {
        return playerRepository.findAll().stream()
                .filter(player -> teamName.equals(player.getTeamAbbreviation())
                        && player.getPlayerName().toLowerCase().contains(playerName.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByNameAndSeason(String playerName, String season) {
        return playerRepository.findAll().stream()
                .filter(player ->  player.getPlayerName().toLowerCase().contains(playerName.toLowerCase())
                    && season.equals(player.getSeason()))
                .collect(Collectors.toList());

    }

    public List<Player> getPlayersByCollege(String college) {
        return playerRepository.findAll().stream()
                .filter(player -> college.equals(player.getCollege()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByCountry(String country) {
        return playerRepository.findAll().stream()
                .filter(player -> country.equals(player.getCountry()))
                .collect(Collectors.toList());
    }

    public Player addPlayer(Player player) {
        return playerRepository.save(player);
    }

    public Player updatePlayer(Long id, Player playerDetails) {
        Player existingPlayer = playerRepository.findPlayerById(id)
                .orElseThrow(() -> new RuntimeException("Player not found"));
        existingPlayer.setPlayerName(playerDetails.getPlayerName());
        existingPlayer.setTeamAbbreviation(playerDetails.getTeamAbbreviation());
        existingPlayer.setAge(playerDetails.getAge());
        existingPlayer.setPlayerHeight(playerDetails.getPlayerHeight());
        existingPlayer.setPlayerWeight(playerDetails.getPlayerWeight());
        existingPlayer.setCollege(playerDetails.getCollege());
        existingPlayer.setCountry(playerDetails.getCountry());
        existingPlayer.setDraftYear(playerDetails.getDraftYear());
        existingPlayer.setDraftRound(playerDetails.getDraftRound());
        existingPlayer.setDraftNumber(playerDetails.getDraftNumber());
        existingPlayer.setGp(playerDetails.getGp());
        existingPlayer.setPts(playerDetails.getPts());
        existingPlayer.setReb(playerDetails.getReb());
        existingPlayer.setAst(playerDetails.getAst());
        existingPlayer.setNetRating(playerDetails.getNetRating());
        existingPlayer.setOrebPct(playerDetails.getOrebPct());
        existingPlayer.setDrebPct(playerDetails.getDrebPct());
        existingPlayer.setUsgPct(playerDetails.getUsgPct());
        existingPlayer.setTsPct(playerDetails.getTsPct());
        existingPlayer.setAstPct(playerDetails.getAstPct());
        existingPlayer.setSeason(playerDetails.getSeason());

        return playerRepository.save(existingPlayer);
    }

    public void deletePlayer(Long id) {
        playerRepository.deletePlayerById(id);
    }
}
