package com.example.library.backend.security.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.library.backend.security.SecurityConstants;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.security.core.Authentication;

@Component
public class JWTAuthorizationFilter extends OncePerRequestFilter {

    @Value("${JWT.secretKey}")
    private String jwtSecretkey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        System.out.println(header);
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.replace("Bearer ", "");

        String id = JWT.require(Algorithm.HMAC512(jwtSecretkey))
                .build()
                .verify(token)
                .getSubject();

        List<String> authorities = JWT.require(Algorithm.HMAC512(jwtSecretkey))
                .build()
                .verify(token)
                .getClaim("roles")
                .asList(String.class);

        Set<GrantedAuthority> authorities2 = new HashSet<>();

        for (String authority : authorities) {
            authorities2.add(new SimpleGrantedAuthority(authority));
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(id, null, authorities2);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}
