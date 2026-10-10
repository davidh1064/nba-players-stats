package com.nba.nba_zone.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Security behaviour that only exists on a real server.
 *
 * <p>Why this is not a MockMvc test: Boot renders errors by forwarding to
 * {@code /error} on the servlet ERROR dispatch, and CORS preflight handling and
 * the error-attribute settings only take effect on that real path. MockMvc
 * performs none of it, so a MockMvc test of these rules passes whether or not
 * the rule exists. An adversarial review proved exactly that: with the ERROR
 * dispatch rule deleted, the MockMvc suite stayed green while a real server
 * answered 401 to every anonymous error.
 *
 * <p>Uses the JDK HTTP client deliberately, so the assertions see raw responses
 * with no Spring test-client behaviour in between.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class SecurityOverHttpTest {

    private static final String ALLOWED_ORIGIN = "http://localhost:3000";

    // Shared: JUnit creates a test instance per method, so a per-instance client
    // would leave one unclosed selector thread behind for every test.
    private static final HttpClient HTTP = HttpClient.newHttpClient();

    @LocalServerPort
    private int port;

    private HttpResponse<String> send(HttpRequest.Builder request) throws Exception {
        return HTTP.send(request.build(), HttpResponse.BodyHandlers.ofString());
    }

    private HttpRequest.Builder request(String path) {
        return HttpRequest.newBuilder(URI.create("http://localhost:" + port + path));
    }

    // ---------- the ERROR dispatch must stay public ----------

    @Test
    @DisplayName("An anonymous miss returns 404, not a 401 from the /error forward")
    void anonymousNotFoundIsNotMaskedAsUnauthorized() throws Exception {
        // Guards SecurityConfig's dispatcherTypeMatchers(DispatcherType.ERROR).permitAll().
        // Without it the forward to /error is re-authorized, fails, and every
        // anonymous error reaches the client as a misleading 401.
        assertThat(send(request("/api/players/4242").GET()).statusCode()).isEqualTo(404);
    }

    @Test
    @DisplayName("An anonymous malformed id returns 400, not 401")
    void anonymousBadRequestIsNotMaskedAsUnauthorized() throws Exception {
        assertThat(send(request("/api/players/not-a-number").GET()).statusCode()).isEqualTo(400);
    }

    @Test
    @DisplayName("A read with a trailing slash is not treated as a protected route")
    void trailingSlashReadIsNotUnauthorized() throws Exception {
        assertThat(send(request("/api/players/").GET()).statusCode()).isNotEqualTo(401);
    }

    // ---------- error responses must not leak internals ----------

    /**
     * The query flags a client can add to ask Boot for debug detail. They do
     * nothing while the spring.web.error.include-* settings are "never", but
     * leak a full stack trace if one is ever set to "on_param" (a common
     * "debug" choice). Probing without them let that regression pass silently.
     */
    private static final String DEBUG_FLAGS = "?trace=true&message=true&errors=true";

    private static void assertNoInternals(HttpResponse<String> response) {
        assertThat(response.body())
                .doesNotContain("\"trace\"")
                .doesNotContain("\"exception\"")
                .doesNotContain("\"message\"")
                .doesNotContain("\"errors\"")
                .doesNotContain("com.nba.nba_zone")
                .doesNotContain("java.lang.");
    }

    @Test
    @DisplayName("A 404 body leaks no internals, even when the client asks for them")
    void notFoundBodyDoesNotLeakInternals() throws Exception {
        // What this proves: no request can extract internals today. What it does
        // NOT prove: that application.properties is what prevents it. Boot 4's
        // own defaults are also "never", so deleting those lines stays green —
        // the guarantee is behavioural. It does catch the settings being turned
        // up ("always" or "on_param"), which is the regression that matters.
        HttpResponse<String> response = send(request("/api/players/4242" + DEBUG_FLAGS).GET());

        assertThat(response.statusCode()).isEqualTo(404);
        assertNoInternals(response);
    }

    @Test
    @DisplayName("A 400 body leaks no conversion detail, even when the client asks for it")
    void badRequestBodyDoesNotLeakInternals() throws Exception {
        // A type-conversion failure carries the richest internal message
        // ("Failed to convert value of type 'java.lang.String' ...").
        HttpResponse<String> response = send(request("/api/players/not-a-number" + DEBUG_FLAGS).GET());

        assertThat(response.statusCode()).isEqualTo(400);
        assertNoInternals(response);
    }

    // ---------- 401s must not trigger a browser login dialog ----------

    @Test
    @DisplayName("An anonymous write gets a bare 401 with no WWW-Authenticate challenge")
    void unauthorizedHasNoBasicChallenge() throws Exception {
        // Guards the HttpStatusEntryPoint in SecurityConfig, which handles requests
        // that send NO credentials. Scope limit, known and filed separately:
        // requests with WRONG credentials are rejected by httpBasic's own entry
        // point and still receive "WWW-Authenticate: Basic" (a browser login
        // dialog), even on public GETs. This test does not cover that case.
        HttpResponse<String> response = send(request("/api/players/1").DELETE());

        assertThat(response.statusCode()).isEqualTo(401);
        assertThat(response.headers().firstValue("WWW-Authenticate")).isEmpty();
    }

    // ---------- CORS ----------

    @Test
    @DisplayName("A preflight from the configured frontend origin is allowed")
    void preflightFromAllowedOriginSucceeds() throws Exception {
        HttpResponse<String> response = send(request("/api/players")
                .method("OPTIONS", HttpRequest.BodyPublishers.noBody())
                .header("Origin", ALLOWED_ORIGIN)
                .header("Access-Control-Request-Method", "POST"));

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.headers().firstValue("Access-Control-Allow-Origin")).contains(ALLOWED_ORIGIN);
    }

    @Test
    @DisplayName("A preflight from an unknown origin is refused")
    void preflightFromUnknownOriginIsRefused() throws Exception {
        HttpResponse<String> response = send(request("/api/players")
                .method("OPTIONS", HttpRequest.BodyPublishers.noBody())
                .header("Origin", "https://evil.example")
                .header("Access-Control-Request-Method", "POST"));

        assertThat(response.statusCode()).isEqualTo(403);
        assertThat(response.headers().firstValue("Access-Control-Allow-Origin")).isEmpty();
    }
}
