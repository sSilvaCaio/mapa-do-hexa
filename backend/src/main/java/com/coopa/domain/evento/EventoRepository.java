package com.coopa.domain.evento;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EventoRepository extends MongoRepository<Evento, String> {
    List<Evento> findByAtivoTrueOrderByCriadoEmDesc();
    List<Evento> findByOrganizadorIdAndAtivoTrue(String organizadorId);
}
