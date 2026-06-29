package com.coopa.domain.evento;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EventoCompartilhadoRepository extends MongoRepository<EventoCompartilhado, String> {

    List<EventoCompartilhado> findByDestinatarioId(String destinatarioId);

    boolean existsByEventoIdAndDestinatarioId(String eventoId, String destinatarioId);
}
