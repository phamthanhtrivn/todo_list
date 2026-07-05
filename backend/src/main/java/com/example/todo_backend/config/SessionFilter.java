package com.example.todo_backend.config;

import jakarta.servlet.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class SessionFilter implements Filter {

    public static final String SESSION_ID_ATTR = "SESSION_ID";
    private static final String COOKIE_NAME = "sessionId";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String sessionId = null;
        if (req.getCookies() != null) {
            for (Cookie cookie : req.getCookies()) {
                if (COOKIE_NAME.equals(cookie.getName())) {
                    sessionId = cookie.getValue();
                    break;
                }
            }
        }

        if (sessionId == null || sessionId.isEmpty()) {
            sessionId = UUID.randomUUID().toString();
            Cookie cookie = new Cookie(COOKIE_NAME, sessionId);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 24 * 365); // 1 year
            // cookie.setSecure(true); // Should be true in prod with HTTPS
            // We set it as a header manually to add SameSite=Strict if needed, but Cookie object is simpler
            res.addCookie(cookie);
        }

        req.setAttribute(SESSION_ID_ATTR, sessionId);
        chain.doFilter(req, res);
    }
}
