package com.coopa.domain.amizade;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AmizadeRepository extends MongoRepository<Amizade, String> {

    Optional<Amizade> findBySolicitanteIdAndReceptorId(String solicitanteId, String receptorId);

    List<Amizade> findByReceptorIdAndStatus(String receptorId, Amizade.StatusAmizade status);

    @Query("{ $or: [ { 'solicitanteId': ?0 }, { 'receptorId': ?0 } ], 'status': 'ACEITA' }")
    List<Amizade> findAmizadesAceitas(String userId);

    @Query("{ $or: [ { 'solicitanteId': ?0, 'receptorId': ?1 }, { 'solicitanteId': ?1, 'receptorId': ?0 } ] }")
    Optional<Amizade> findByPar(String userId1, String userId2);
}
