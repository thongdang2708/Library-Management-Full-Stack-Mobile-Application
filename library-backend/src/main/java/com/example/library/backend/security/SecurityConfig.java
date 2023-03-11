package com.example.library.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

import com.example.library.backend.security.filter.AuthenticationFilter;
import com.example.library.backend.security.filter.ExceptionHandlerFilter;
import com.example.library.backend.security.filter.JWTAuthorizationFilter;
import com.example.library.backend.security.handler.CustomAccessDenyHandler;
import com.example.library.backend.security.manager.CustomAuthenticationManager;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    @Autowired
    private CustomAuthenticationManager authenticationManager;

    @Autowired
    private CustomAccessDenyHandler accessDenyHandler;

    @Value("${JWT.expiration}")
    private String jwtExpiration;

    @Value("${JWT.secretKey}")
    private String jwtSecretkey;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        AuthenticationFilter authenticationFilter = new AuthenticationFilter(authenticationManager, jwtExpiration,
                jwtSecretkey);
        authenticationFilter.setFilterProcessesUrl("/login");

        http.exceptionHandling().accessDeniedHandler(accessDenyHandler);

        http.csrf().disable()
                .httpBasic()
                .and()
                .addFilterBefore(new ExceptionHandlerFilter(), AuthenticationFilter.class)
                .addFilter(authenticationFilter)
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        return http.build();
    }
}
