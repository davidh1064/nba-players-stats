package com.nba.nba_zone.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Startup must fail rather than fall back to a guessable credential — an API
 * that boots with a default password is not actually protected.
 */
class SecurityPropertiesTest {

    private static SecurityProperties properties(String username, String password) {
        SecurityProperties properties = new SecurityProperties();
        properties.setAdminUsername(username);
        properties.setAdminPassword(password);
        properties.setAllowedOrigins(List.of("http://localhost:3000"));
        return properties;
    }

    @Test
    @DisplayName("A valid configuration passes validation")
    void validConfigurationIsAccepted() {
        assertThatCode(() -> properties("admin", "a-sufficiently-long-secret").validate())
                .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("A missing password fails startup")
    void missingPasswordIsRejected() {
        assertThatThrownBy(() -> properties("admin", null).validate())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("admin-password");
    }

    @Test
    @DisplayName("A blank password fails startup")
    void blankPasswordIsRejected() {
        assertThatThrownBy(() -> properties("admin", "   ").validate())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("admin-password");
    }

    @Test
    @DisplayName("A missing username fails startup")
    void missingUsernameIsRejected() {
        assertThatThrownBy(() -> properties(null, "a-sufficiently-long-secret").validate())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("admin-username");
    }

    @Test
    @DisplayName("A short password fails startup")
    void shortPasswordIsRejected() {
        assertThatThrownBy(() -> properties("admin", "short").validate())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("at least 12 characters");
    }

    @Test
    @DisplayName("A long-enough password built around a placeholder still fails startup")
    void placeholderPasswordIsRejected() {
        // Long enough to clear the length check, so this exercises the token
        // check rather than being rejected for length first.
        assertThatThrownBy(() -> properties("admin", "ChangeMe123456").validate())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("placeholder");
    }

    @Test
    @DisplayName("A padded common password fails startup")
    void paddedCommonPasswordIsRejected() {
        assertThatThrownBy(() -> properties("admin", "MyPassword2024!").validate())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("placeholder");
    }

    @Test
    @DisplayName("Wildcard CORS origin fails startup")
    void wildcardOriginIsRejected() {
        SecurityProperties properties = properties("admin", "a-sufficiently-long-secret");
        properties.setAllowedOrigins(List.of("*"));

        assertThatThrownBy(properties::validate)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("cannot be \"*\"");
    }

    @Test
    @DisplayName("Empty CORS origin list fails startup")
    void emptyOriginsAreRejected() {
        SecurityProperties properties = properties("admin", "a-sufficiently-long-secret");
        properties.setAllowedOrigins(List.of());

        assertThatThrownBy(properties::validate)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("at least one origin");
    }
}
