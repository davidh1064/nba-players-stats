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

    // 1-field combinations
    public List<Player> getPlayersByTeam(String teamName) {
        return playerRepository.findAll().stream()
                .filter(player -> player.getTeamAbbreviation().toLowerCase().contains(teamName.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByName(String searchText) {
        return playerRepository.findAll().stream()
                .filter(player -> player.getPlayerName().toLowerCase().contains(searchText.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByCollege(String college) {
        return playerRepository.findAll().stream()
                .filter(player -> player.getCollege().toLowerCase().contains(college.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByCountry(String country) {
        return playerRepository.findAll().stream()
                .filter(player -> player.getCountry().toLowerCase().contains(country.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersBySeason(String season) {
        return playerRepository.findAll().stream()
                .filter(player -> season.equals(player.getSeason()))
                .collect(Collectors.toList());
    }


    // 2-field combinations
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

    public List<Player> getPlayersByNameAndCountry(String playerName, String country) {
        return playerRepository.findAll().stream()
                .filter(player ->  player.getPlayerName().toLowerCase().contains(playerName.toLowerCase())
                        && player.getCountry().toLowerCase().contains(country.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByNameAndCollege(String playerName, String college) {
        return playerRepository.findAll().stream()
                .filter(player -> player.getPlayerName().toLowerCase().contains(playerName.toLowerCase())
                        && player.getCollege().toLowerCase().contains(college.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByTeamAndSeason(String teamName, String season) {
        return playerRepository.findAll().stream()
                .filter(player -> player.getTeamAbbreviation().toLowerCase().contains(teamName.toLowerCase())
                        && season.equals(player.getSeason()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByTeamAndCollege(String teamName, String college) {
        return playerRepository.findAll().stream()
                .filter(player -> player.getTeamAbbreviation().toLowerCase().contains(teamName.toLowerCase())
                        && player.getCollege().toLowerCase().contains(college.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByTeamAndCountry(String teamName, String country) {
        return playerRepository.findAll().stream()
                .filter(player -> player.getTeamAbbreviation().toLowerCase().contains(teamName.toLowerCase())
                        && player.getCountry().toLowerCase().contains(country.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersBySeasonAndCollege(String season, String college) {
        return playerRepository.findAll().stream()
                .filter(player -> season.equals(player.getSeason())
                        && player.getCollege().toLowerCase().contains(college.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersBySeasonAndCountry(String season, String country) {
        return playerRepository.findAll().stream()
                .filter(player -> season.equals(player.getSeason())
                        && player.getCountry().toLowerCase().contains(country.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByCollegeAndCountry(String college, String country) {
        return playerRepository.findAll().stream()
                .filter(player -> player.getCollege().toLowerCase().contains(college.toLowerCase())
                        && player.getCountry().toLowerCase().contains(country.toLowerCase()))
                .collect(Collectors.toList());
    }

    // 3-field combinations
    public List<Player> getPlayersByNameTeamAndSeason(String playerName, String teamName, String season) {
        return playerRepository.findAll().stream()
                .filter(player ->
                        player.getPlayerName().toLowerCase().contains(playerName.toLowerCase()) &&
                                player.getTeamAbbreviation().equalsIgnoreCase(teamName) &&
                                season.equals(player.getSeason()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByNameTeamAndCollege(String playerName, String teamName, String college) {
        return playerRepository.findAll().stream()
                .filter(player ->
                        player.getPlayerName().toLowerCase().contains(playerName.toLowerCase()) &&
                                player.getTeamAbbreviation().equalsIgnoreCase(teamName) &&
                                player.getCollege().toLowerCase().contains(college.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByNameTeamAndCountry(String playerName, String teamName, String country) {
        return playerRepository.findAll().stream()
                .filter(player ->
                        player.getPlayerName().toLowerCase().contains(playerName.toLowerCase()) &&
                                player.getTeamAbbreviation().equalsIgnoreCase(teamName) &&
                                player.getCountry().toLowerCase().contains(country.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByNameSeasonAndCollege(String playerName, String season, String college) {
        return playerRepository.findAll().stream()
                .filter(player ->
                        player.getPlayerName().toLowerCase().contains(playerName.toLowerCase()) &&
                                season.equals(player.getSeason()) &&
                                player.getCollege().toLowerCase().contains(college.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByNameSeasonAndCountry(String playerName, String season, String country) {
        return playerRepository.findAll().stream()
                .filter(player ->
                        player.getPlayerName().toLowerCase().contains(playerName.toLowerCase()) &&
                                season.equals(player.getSeason()) &&
                                player.getCountry().toLowerCase().contains(country.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByNameCollegeAndCountry(String playerName, String college, String country) {
        return playerRepository.findAll().stream()
                .filter(player ->
                        player.getPlayerName().toLowerCase().contains(playerName.toLowerCase()) &&
                                player.getCollege().toLowerCase().contains(college.toLowerCase()) &&
                                player.getCountry().toLowerCase().contains(country.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByTeamSeasonAndCollege(String teamName, String season, String college) {
        return playerRepository.findAll().stream()
                .filter(player ->
                        player.getTeamAbbreviation().equalsIgnoreCase(teamName) &&
                                season.equals(player.getSeason()) &&
                                player.getCollege().toLowerCase().contains(college.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByTeamSeasonAndCountry(String teamName, String season, String country) {
        return playerRepository.findAll().stream()
                .filter(player ->
                        player.getTeamAbbreviation().equalsIgnoreCase(teamName) &&
                                season.equals(player.getSeason()) &&
                                player.getCountry().toLowerCase().contains(country.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByTeamCollegeAndCountry(String teamName, String college, String country) {
        return playerRepository.findAll().stream()
                .filter(player ->
                        player.getTeamAbbreviation().equalsIgnoreCase(teamName) &&
                                player.getCollege().toLowerCase().contains(college.toLowerCase()) &&
                                player.getCountry().toLowerCase().contains(country.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersBySeasonCollegeAndCountry(String season, String college, String country) {
        return playerRepository.findAll().stream()
                .filter(player ->
                        season.equals(player.getSeason()) &&
                                player.getCollege().toLowerCase().contains(college.toLowerCase()) &&
                                player.getCountry().toLowerCase().contains(country.toLowerCase()))
                .collect(Collectors.toList());
    }

    // 4-field combinations
    public List<Player> getPlayersByNameTeamSeasonAndCollege(String playerName, String teamName, String season, String college) {
        return playerRepository.findAll().stream()
                .filter(player ->
                        player.getPlayerName().toLowerCase().contains(playerName.toLowerCase()) &&
                                player.getTeamAbbreviation().equalsIgnoreCase(teamName) &&
                                season.equals(player.getSeason()) &&
                                player.getCollege().toLowerCase().contains(college.toLowerCase()))
                .collect(Collectors.toList());
    }
    public List<Player> getPlayersByNameTeamSeasonAndCountry(String playerName, String teamName, String season, String country) {
        return playerRepository.findAll().stream()
                .filter(player ->
                        player.getPlayerName().toLowerCase().contains(playerName.toLowerCase()) &&
                                player.getTeamAbbreviation().equalsIgnoreCase(teamName) &&
                                season.equals(player.getSeason()) &&
                                player.getCountry().toLowerCase().contains(country.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByNameTeamCollegeAndCountry(String playerName, String teamName, String college, String country) {
        return playerRepository.findAll().stream()
                .filter(player ->
                        player.getPlayerName().toLowerCase().contains(playerName.toLowerCase()) &&
                                player.getTeamAbbreviation().equalsIgnoreCase(teamName) &&
                                player.getCollege().toLowerCase().contains(college.toLowerCase()) &&
                                player.getCountry().toLowerCase().contains(country.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByNameSeasonCollegeAndCountry(String playerName, String season, String college, String country) {
        return playerRepository.findAll().stream()
                .filter(player ->
                        player.getPlayerName().toLowerCase().contains(playerName.toLowerCase()) &&
                                season.equals(player.getSeason()) &&
                                player.getCollege().toLowerCase().contains(college.toLowerCase()) &&
                                player.getCountry().toLowerCase().contains(country.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByTeamSeasonCollegeAndCountry(String teamName, String season, String college, String country) {
        return playerRepository.findAll().stream()
                .filter(player ->
                        player.getTeamAbbreviation().equalsIgnoreCase(teamName) &&
                                season.equals(player.getSeason()) &&
                                player.getCollege().toLowerCase().contains(college.toLowerCase()) &&
                                player.getCountry().toLowerCase().contains(country.toLowerCase()))
                .collect(Collectors.toList());
    }

    // 5-field combination
    public List<Player> getPlayersByAllFields(String playerName, String teamName, String season, String college, String country) {
        return playerRepository.findAll().stream()
                .filter(player ->
                        player.getPlayerName().toLowerCase().contains(playerName.toLowerCase()) &&
                                player.getTeamAbbreviation().equalsIgnoreCase(teamName) &&
                                season.equals(player.getSeason()) &&
                                player.getCollege().toLowerCase().contains(college.toLowerCase()) &&
                                player.getCountry().toLowerCase().contains(country.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Player> filterPlayers(String playerName, String teamName, String season, String college, String country) {
        Specification<Player> spec = Specification
                .where(PlayerSpecifications.hasPlayerName(playerName))
                .and(PlayerSpecifications.hasTeamName(teamName))
                .and(PlayerSpecifications.hasSeason(season))
                .and(PlayerSpecifications.hasCollege(college))
                .and(PlayerSpecifications.hasCountry(country));

        return playerRepository.findAll(spec);
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
