package com.coopa.domain.mural;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MuralRepository extends MongoRepository<MensagemMural, String> {
    List<MensagemMural> findByEventoIdOrderByCriadoEmAsc(String eventoId);
}
