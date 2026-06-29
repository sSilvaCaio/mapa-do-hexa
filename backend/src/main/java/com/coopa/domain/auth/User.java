package com.coopa.domain.auth;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String nome;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true, sparse = true)
    private String username;

    private String password;

    private String avatarUrl;

    private Long criadoEm;
    private Long atualizadoEm;
}
