package com.nba.nba_zone.player;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nba.nba_zone.config.SecurityConfig;
import com.nba.nba_zone.config.SecurityProperties;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.not;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * The security contract for the API: reads are open to anyone, writes are not.
 *
 * <p>These assertions are the regression guard for the vulnerability this
 * configuration closed — before it, every request below succeeded unauthenticated.
 */
@WebMvcTest(PlayerController.class)
@Import(SecurityConfig.class)
@EnableConfigurationProperties(SecurityProperties.class)
@TestPropertySource(properties = {
        "app.security.admin-username=test-admin",
        "app.security.admin-password=test-admin-credential-9f2a",
        "app.security.allowed-origins=http://localhost:3000"
})
class PlayerControllerSecurityTest {

    private static final String ADMIN_USER = "test-admin";
    private static final String ADMIN_PASSWORD = "test-admin-credential-9f2a";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private PlayerService playerService;

    // ---------- reads stay public ----------

    @Test
    @DisplayName("GET /api/players is reachable without credentials")
    void listPlayersIsPublic() throws Exception {
        when(playerService.filterPlayers(any(), any(), any(), any(), any())).thenReturn(List.of());

        mockMvc.perform(get("/api/players"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/players/{id} is reachable without credentials")
    void getPlayerByIdIsPublic() throws Exception {
        when(playerService.getPlayerById(1L)).thenReturn(new Player());

        mockMvc.perform(get("/api/players/1"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("An anonymous miss returns 404, not a misleading 401")
    void anonymousNotFoundIsNotMaskedAsUnauthorized() throws Exception {
        // Regression guard: Boot renders errors by forwarding to /error, and that
        // forward re-enters the filter chain. Without the ERROR dispatch rule this
        // 404 comes back to the client as a 401.
        when(playerService.getPlayerById(4242L)).thenReturn(null);

        mockMvc.perform(get("/api/players/4242"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("A read with a trailing slash is not treated as a protected route")
    void trailingSlashReadIsNotUnauthorized() throws Exception {
        mockMvc.perform(get("/api/players/"))
                .andExpect(status().is(not(401)));
    }

    // ---------- writes are rejected without credentials ----------

    @Test
    @DisplayName("POST /api/players is rejected without credentials")
    void createRequiresAuthentication() throws Exception {
        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new Player())))
                .andExpect(status().isUnauthorized());

        verify(playerService, never()).addPlayer(any());
    }

    @Test
    @DisplayName("PUT /api/players is rejected without credentials")
    void updateRequiresAuthentication() throws Exception {
        mockMvc.perform(put("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new Player())))
                .andExpect(status().isUnauthorized());

        verify(playerService, never()).updatePlayer(anyLong(), any());
    }

    @Test
    @DisplayName("DELETE /api/players/{id} is rejected without credentials")
    void deleteRequiresAuthentication() throws Exception {
        mockMvc.perform(delete("/api/players/1"))
                .andExpect(status().isUnauthorized());

        verify(playerService, never()).deletePlayer(anyLong());
    }

    @Test
    @DisplayName("Write endpoints are rejected when the password is wrong")
    void wrongPasswordIsRejected() throws Exception {
        mockMvc.perform(delete("/api/players/1")
                        .with(httpBasic(ADMIN_USER, "not-the-password")))
                .andExpect(status().isUnauthorized());

        verify(playerService, never()).deletePlayer(anyLong());
    }

    @Test
    @DisplayName("Write endpoints are rejected for an unknown user")
    void unknownUserIsRejected() throws Exception {
        mockMvc.perform(delete("/api/players/1")
                        .with(httpBasic("someone-else", ADMIN_PASSWORD)))
                .andExpect(status().isUnauthorized());

        verify(playerService, never()).deletePlayer(anyLong());
    }

    // ---------- writes succeed for the admin ----------

    @Test
    @DisplayName("POST /api/players succeeds with admin credentials")
    void createSucceedsForAdmin() throws Exception {
        Player saved = new Player();
        when(playerService.addPlayer(any())).thenReturn(saved);

        mockMvc.perform(post("/api/players")
                        .with(httpBasic(ADMIN_USER, ADMIN_PASSWORD))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new Player())))
                .andExpect(status().isCreated());

        verify(playerService).addPlayer(any());
    }

    @Test
    @DisplayName("DELETE /api/players/{id} succeeds with admin credentials")
    void deleteSucceedsForAdmin() throws Exception {
        mockMvc.perform(delete("/api/players/1")
                        .with(httpBasic(ADMIN_USER, ADMIN_PASSWORD)))
                .andExpect(status().isNoContent());

        verify(playerService).deletePlayer(1L);
    }
}
