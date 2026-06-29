package com.coopa.domain.inscricao;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "inscricoes")
@CompoundIndex(name = "evento_user_idx", def = "{'eventoId': 1, 'userId': 1}", unique = true)
public class Inscricao {

    @Id
    private String id;

    private String eventoId;
    private String userId;
    private String userNome;

    private Long criadoEm;
    private boolean ativa;
}
