package com.coopa.domain.inscricao;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface InscricaoRepository extends MongoRepository<Inscricao, String> {
    Optional<Inscricao> findByEventoIdAndUserId(String eventoId, String userId);
    List<Inscricao> findByEventoIdAndAtivaTrue(String eventoId);
    long countByEventoIdAndAtivaTrue(String eventoId);
}
