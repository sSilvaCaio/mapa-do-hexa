package com.mapadohexa.mapa_hexa.microservices.userAuthenticator.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    private String nome;

    @Indexed(unique = true)
    private String email;

    private String password;

    private Long criadoEm;

    public User(String nome, String email, String password) {
        this.nome = nome;
        this.email = email;
        this.password = password;
        this.criadoEm = System.currentTimeMillis();
    }
}

