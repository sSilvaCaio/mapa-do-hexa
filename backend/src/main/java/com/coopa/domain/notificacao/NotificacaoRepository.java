package com.coopa.domain.notificacao;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificacaoRepository extends MongoRepository<Notificacao, String> {

    List<Notificacao> findByUserIdOrderByCriadoEmDesc(String userId);

    long countByUserIdAndLidaFalse(String userId);
}
