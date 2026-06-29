package com.coopa.domain.amizade;

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
@Document(collection = "amizades")
@CompoundIndex(name = "par_unico", def = "{'solicitanteId': 1, 'receptorId': 1}", unique = true)
public class Amizade {

    @Id
    private String id;

    private String solicitanteId;
    private String solicitanteNome;
    private String solicitanteUsername;

    private String receptorId;
    private String receptorNome;
    private String receptorUsername;

    private StatusAmizade status;

    private Long criadoEm;
    private Long atualizadoEm;

    public enum StatusAmizade {
        PENDENTE, ACEITA, RECUSADA
    }
}
