package com.nba.nba_zone.player;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nba.nba_zone.config.SecurityConfig;
import com.nba.nba_zone.config.SecurityProperties;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static com.nba.nba_zone.player.PlayerTestData.curry;
import static com.nba.nba_zone.player.PlayerTestData.lebron;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * The HTTP contract of {@link PlayerController}: parameter binding, status
 * codes and JSON shape. The authentication rules are covered separately in
 * {@link PlayerControllerSecurityTest}.
 */
@WebMvcTest(PlayerController.class)
@Import(SecurityConfig.class)
@EnableConfigurationProperties(SecurityProperties.class)
@TestPropertySource(properties = {
        "app.security.admin-username=test-admin",
        "app.security.admin-password=test-admin-credential-9f2a",
        "app.security.allowed-origins=http://localhost:3000"
})
class PlayerControllerTest {

    private static final String ADMIN_USER = "test-admin";
    private static final String ADMIN_PASSWORD = "test-admin-credential-9f2a";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private PlayerService playerService;

    @Test
    @DisplayName("GET /api/players returns the players as a JSON array")
    void listReturnsJsonArray() throws Exception {
        when(playerService.filterPlayers(any(), any(), any(), any(), any()))
                .thenReturn(List.of(lebron(), curry()));

        mockMvc.perform(get("/api/players"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(2)))
                .andExpect(jsonPath("$[0].playerName").value("LeBron James"))
                .andExpect(jsonPath("$[1].teamAbbreviation").value("GSW"));
    }

    @Test
    @DisplayName("GET /api/players forwards each query parameter into the right argument")
    void queryParametersMapToTheCorrectArguments() throws Exception {
        // The controller takes (playerName, teamName, college, country, season)
        // but calls filterPlayers(playerName, teamName, season, college, country).
        // Distinct values per parameter make a mis-ordered mapping visible.
        when(playerService.filterPlayers(any(), any(), any(), any(), any())).thenReturn(List.of());

        mockMvc.perform(get("/api/players")
                        .param("playerName", "NAME")
                        .param("teamName", "TEAM")
                        .param("college", "COLLEGE")
                        .param("country", "COUNTRY")
                        .param("season", "SEASON"))
                .andExpect(status().isOk());

        ArgumentCaptor<String> name = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> team = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> season = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> college = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> country = ArgumentCaptor.forClass(String.class);

        verify(playerService).filterPlayers(
                name.capture(), team.capture(), season.capture(), college.capture(), country.capture());

        assertThat(name.getValue()).isEqualTo("NAME");
        assertThat(team.getValue()).isEqualTo("TEAM");
        assertThat(season.getValue()).isEqualTo("SEASON");
        assertThat(college.getValue()).isEqualTo("COLLEGE");
        assertThat(country.getValue()).isEqualTo("COUNTRY");
    }

    @Test
    @DisplayName("GET /api/players passes nulls when no parameters are supplied")
    void omittedParametersBecomeNull() throws Exception {
        when(playerService.filterPlayers(any(), any(), any(), any(), any())).thenReturn(List.of());

        mockMvc.perform(get("/api/players")).andExpect(status().isOk());

        verify(playerService).filterPlayers(null, null, null, null, null);
    }

    @Test
    @DisplayName("GET /api/players/{id} returns the player")
    void getByIdReturnsPlayer() throws Exception {
        when(playerService.getPlayerById(1L)).thenReturn(lebron());

        mockMvc.perform(get("/api/players/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.playerName").value("LeBron James"));
    }

    @Test
    @DisplayName("GET /api/players/{id} returns 404 when the service finds nothing")
    void getByIdReturnsNotFound() throws Exception {
        when(playerService.getPlayerById(99L)).thenReturn(null);

        mockMvc.perform(get("/api/players/99")).andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/players/{id} returns 400 for a non-numeric id")
    void getByIdRejectsNonNumericId() throws Exception {
        mockMvc.perform(get("/api/players/not-a-number"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/players returns 201 with the created player")
    void createReturnsCreated() throws Exception {
        when(playerService.addPlayer(any())).thenReturn(lebron());

        mockMvc.perform(post("/api/players")
                        .with(httpBasic(ADMIN_USER, ADMIN_PASSWORD))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(lebron())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.playerName").value("LeBron James"));
    }

    @Test
    @DisplayName("POST /api/players returns 400 for a malformed body")
    void createRejectsMalformedJson() throws Exception {
        mockMvc.perform(post("/api/players")
                        .with(httpBasic(ADMIN_USER, ADMIN_PASSWORD))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{not json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("PUT /api/players updates using the id from the body")
    void updateUsesIdFromBody() throws Exception {
        when(playerService.updatePlayer(eq(1L), any())).thenReturn(lebron());

        mockMvc.perform(put("/api/players")
                        .with(httpBasic(ADMIN_USER, ADMIN_PASSWORD))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(lebron())))
                .andExpect(status().isOk());

        verify(playerService).updatePlayer(eq(1L), any());
    }

    @Test
    @DisplayName("PUT /api/players returns 400 when the body has no id")
    void updateWithoutIdIsRejected() throws Exception {
        Player noId = new Player();

        mockMvc.perform(put("/api/players")
                        .with(httpBasic(ADMIN_USER, ADMIN_PASSWORD))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(noId)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("PUT /api/players surfaces the service's 404 for a missing player")
    void updateMissingPlayerReturnsNotFound() throws Exception {
        when(playerService.updatePlayer(eq(99L), any()))
                .thenThrow(new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND));

        Player missing = lebron();
        missing.setId(99L);

        mockMvc.perform(put("/api/players")
                        .with(httpBasic(ADMIN_USER, ADMIN_PASSWORD))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(missing)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/players/{id} returns 204 with no body")
    void deleteReturnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/players/1")
                        .with(httpBasic(ADMIN_USER, ADMIN_PASSWORD)))
                .andExpect(status().isNoContent())
                .andExpect(content().string(""));

        verify(playerService).deletePlayer(1L);
    }

    @Test
    @DisplayName("DELETE /api/players/{id} surfaces the service's 404")
    void deleteMissingPlayerReturnsNotFound() throws Exception {
        doThrow(new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND))
                .when(playerService).deletePlayer(99L);

        mockMvc.perform(delete("/api/players/99")
                        .with(httpBasic(ADMIN_USER, ADMIN_PASSWORD)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Error responses do not leak internal messages")
    void errorResponsesDoNotLeakDetail() throws Exception {
        when(playerService.getPlayerById(99L)).thenReturn(null);

        String body = mockMvc.perform(get("/api/players/99"))
                .andExpect(status().isNotFound())
                .andReturn().getResponse().getContentAsString();

        assertThat(body).doesNotContain("Player 99 not found");
        assertThat(body).doesNotContain("com.nba.nba_zone");
    }
}
