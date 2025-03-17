package com.nba.nba_zone.player;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name= "player_stats")
public class Player {
    @Id
    private Long id;

    private String playerName;
    private String teamAbbreviation;
    private Float age;
    private Float playerHeight;
    private Float playerWeight;
    private String college;
    private String country;
    private String draftYear;
    private String draftRound;
    private String draftNumber;
    private Integer gp;
    private Float pts;
    private Float reb;
    private Float ast;
    private Float netRating;
    private Float orebPct;
    private Float drebPct;
    private Float usgPct;
    private Float tsPct;
    private Float astPct;
    private String season;

    public Player() {}

    public Player(String playerName, Long id, String teamAbbreviation, Float age, Float playerHeight, Float playerWeight, String college, String country, String draftYear, String draftRound, String draftNumber, Integer gp, Float pts, Float reb, Float ast, Float netRating, Float orebPct, Float drebPct, Float usgPct, Float tsPct, Float astPct, String season) {
        this.playerName = playerName;
        this.id = id;
        this.teamAbbreviation = teamAbbreviation;
        this.age = age;
        this.playerHeight = playerHeight;
        this.playerWeight = playerWeight;
        this.college = college;
        this.country = country;
        this.draftYear = draftYear;
        this.draftRound = draftRound;
        this.draftNumber = draftNumber;
        this.gp = gp;
        this.pts = pts;
        this.reb = reb;
        this.ast = ast;
        this.netRating = netRating;
        this.orebPct = orebPct;
        this.drebPct = drebPct;
        this.usgPct = usgPct;
        this.tsPct = tsPct;
        this.astPct = astPct;
        this.season = season;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getTeamAbbreviation() {
        return teamAbbreviation;
    }

    public void setTeamAbbreviation(String teamAbbreviation) {
        this.teamAbbreviation = teamAbbreviation;
    }

    public Float getAge() {
        return age;
    }

    public void setAge(Float age) {
        this.age = age;
    }

    public Float getPlayerHeight() {
        return playerHeight;
    }

    public void setPlayerHeight(Float playerHeight) {
        this.playerHeight = playerHeight;
    }

    public Float getPlayerWeight() {
        return playerWeight;
    }

    public void setPlayerWeight(Float playerWeight) {
        this.playerWeight = playerWeight;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getDraftYear() {
        return draftYear;
    }

    public void setDraftYear(String draftYear) {
        this.draftYear = draftYear;
    }

    public String getDraftRound() {
        return draftRound;
    }

    public void setDraftRound(String draftRound) {
        this.draftRound = draftRound;
    }

    public String getDraftNumber() {
        return draftNumber;
    }

    public void setDraftNumber(String draftNumber) {
        this.draftNumber = draftNumber;
    }

    public Integer getGp() {
        return gp;
    }

    public void setGp(Integer gp) {
        this.gp = gp;
    }

    public Float getPts() {
        return pts;
    }

    public void setPts(Float pts) {
        this.pts = pts;
    }

    public Float getReb() {
        return reb;
    }

    public void setReb(Float reb) {
        this.reb = reb;
    }

    public Float getAst() {
        return ast;
    }

    public void setAst(Float ast) {
        this.ast = ast;
    }

    public Float getNetRating() {
        return netRating;
    }

    public void setNetRating(Float netRating) {
        this.netRating = netRating;
    }

    public Float getOrebPct() {
        return orebPct;
    }

    public void setOrebPct(Float orebPct) {
        this.orebPct = orebPct;
    }

    public Float getDrebPct() {
        return drebPct;
    }

    public void setDrebPct(Float drebPct) {
        this.drebPct = drebPct;
    }

    public Float getUsgPct() {
        return usgPct;
    }

    public void setUsgPct(Float usgPct) {
        this.usgPct = usgPct;
    }

    public Float getTsPct() {
        return tsPct;
    }

    public void setTsPct(Float tsPct) {
        this.tsPct = tsPct;
    }

    public Float getAstPct() {
        return astPct;
    }

    public void setAstPct(Float astPct) {
        this.astPct = astPct;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }
}
