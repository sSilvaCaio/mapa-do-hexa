package com.coopa.domain.evento;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "eventos")
public class Evento {

    @Id
    private String id;

    private String organizadorId;
    private String organizadorNome;

    private String titulo;
    private String jogo;
    private String data;
    private String horario;
    private String nomeLocal;
    private String endereco;
    private Double lat;
    private Double lng;

    private String descricao;
    private String oQueLevar;
    private String infraestrutura;

    private Integer maxParticipantes;
    private Integer totalInscritos;

    private Long criadoEm;
    private boolean ativo;
}
