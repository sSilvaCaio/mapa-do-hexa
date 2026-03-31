package com.mapadohexa.mapa_hexa.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    // O Spring vai no application.properties, procura essa chave e injeta o valor aqui
    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Libera o CORS para todas as rotas da sua API (ex: /login, /eventos)
                .allowedOrigins(allowedOrigins) // Usa a variável que veio do arquivo de propriedades
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos HTTP permitidos
                .allowedHeaders("*") // Permite que o React envie qualquer cabeçalho (útil para tokens JWT)
                .allowCredentials(true); // Fundamental se vocês forem usar cookies de sessão ou tokens
    }
}