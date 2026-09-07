package com.nba.nba_zone.config;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Security settings, bound from configuration (and therefore from environment
 * variables such as {@code ADMIN_USERNAME} / {@code ADMIN_PASSWORD}).
 *
 * <p>There is deliberately no default password. Booting with a built-in
 * credential is how an API ends up "secured" in name only, so a missing or
 * weak password fails startup loudly instead of leaving the write endpoints
 * open behind a value everyone already knows.
 */
@Component
@ConfigurationProperties(prefix = "app.security")
public class SecurityProperties {

    /** Minimum length for the admin password. Short enough to be usable, long enough not to be guessable. */
    private static final int MIN_PASSWORD_LENGTH = 12;

    /**
     * Substrings that mark a password as a placeholder rather than a real secret.
     * Matched as substrings, not equality: every one of these is shorter than
     * {@link #MIN_PASSWORD_LENGTH}, so an equality check could never fire — it
     * would be rejected for length first, and "changeme1234" would slip through.
     */
    private static final List<String> REJECTED_PASSWORD_TOKENS =
            List.of("password", "changeme", "letmein", "qwerty", "admin123");

    private String adminUsername;
    private String adminPassword;
    private List<String> allowedOrigins = List.of("http://localhost:3000");

    @PostConstruct
    void validate() {
        if (isBlank(adminUsername)) {
            throw new IllegalStateException(
                    "app.security.admin-username is not set. Set the ADMIN_USERNAME environment "
                            + "variable (or add it to backend/.env) before starting the application.");
        }

        if (isBlank(adminPassword)) {
            throw new IllegalStateException(
                    "app.security.admin-password is not set. Set the ADMIN_PASSWORD environment "
                            + "variable (or add it to backend/.env) before starting the application. "
                            + "The write endpoints (POST/PUT/DELETE /api/players) depend on it.");
        }

        if (adminPassword.length() < MIN_PASSWORD_LENGTH) {
            throw new IllegalStateException(
                    "app.security.admin-password must be at least " + MIN_PASSWORD_LENGTH
                            + " characters; got " + adminPassword.length() + ".");
        }

        String lowercasePassword = adminPassword.toLowerCase();
        if (REJECTED_PASSWORD_TOKENS.stream().anyMatch(lowercasePassword::contains)) {
            throw new IllegalStateException(
                    "app.security.admin-password is a well-known placeholder value. Choose a real secret.");
        }

        if (allowedOrigins == null || allowedOrigins.isEmpty()) {
            throw new IllegalStateException(
                    "app.security.allowed-origins must list at least one origin.");
        }

        if (allowedOrigins.contains("*")) {
            // With allowCredentials(true) the browser rejects "*" anyway; failing
            // here makes the reason obvious instead of surfacing as a CORS error.
            throw new IllegalStateException(
                    "app.security.allowed-origins cannot be \"*\" because credentials are allowed. "
                            + "List the frontend origins explicitly.");
        }
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    public String getAdminUsername() {
        return adminUsername;
    }

    public void setAdminUsername(String adminUsername) {
        this.adminUsername = adminUsername;
    }

    public String getAdminPassword() {
        return adminPassword;
    }

    public void setAdminPassword(String adminPassword) {
        this.adminPassword = adminPassword;
    }

    public List<String> getAllowedOrigins() {
        return allowedOrigins;
    }

    public void setAllowedOrigins(List<String> allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }
}
