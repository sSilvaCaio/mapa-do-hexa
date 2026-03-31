package com.mapadohexa.mapa_hexa.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // <-- NÃO ESQUEÇA ESTE IMPORT
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) 
            .cors(Customizer.withDefaults()) 
            .authorizeHttpRequests(auth -> auth
                // O SEGREDO: Libera o "Preflight" do navegador para qualquer rota
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                
                // Libera a sua rota de teste
                .requestMatchers("/api/status").permitAll() 
                
                // Bloqueia o resto exigindo login
                .anyRequest().authenticated() 
            );

        return http.build();
    }
}