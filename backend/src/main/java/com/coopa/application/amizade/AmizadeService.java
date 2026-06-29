package com.coopa.application.amizade;

import com.coopa.application.amizade.dto.AmizadeResponseDTO;
import com.coopa.domain.amizade.Amizade;
import com.coopa.domain.amizade.AmizadeRepository;
import com.coopa.domain.auth.User;
import com.coopa.domain.auth.UserRepository;
import com.coopa.domain.notificacao.Notificacao;
import com.coopa.domain.notificacao.NotificacaoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AmizadeService {

    private final AmizadeRepository amizadeRepository;
    private final UserRepository userRepository;
    private final NotificacaoRepository notificacaoRepository;

    public AmizadeResponseDTO solicitar(String solicitanteId, String receptorUsername) {
        User solicitante = userRepository.findById(solicitanteId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        User receptor = userRepository.findByUsername(receptorUsername)
                .orElseThrow(() -> new IllegalArgumentException("Usuário @" + receptorUsername + " não encontrado"));

        if (receptor.getId().equals(solicitanteId)) {
            throw new IllegalArgumentException("Você não pode adicionar a si mesmo");
        }

        amizadeRepository.findByPar(solicitanteId, receptor.getId()).ifPresent(a -> {
            if (a.getStatus() == Amizade.StatusAmizade.ACEITA) {
                throw new IllegalArgumentException("Vocês já são amigos");
            }
            if (a.getStatus() == Amizade.StatusAmizade.PENDENTE) {
                throw new IllegalArgumentException("Solicitação já enviada");
            }
        });

        Amizade amizade = Amizade.builder()
                .solicitanteId(solicitanteId)
                .solicitanteNome(solicitante.getNome())
                .solicitanteUsername(solicitante.getUsername())
                .receptorId(receptor.getId())
                .receptorNome(receptor.getNome())
                .receptorUsername(receptor.getUsername())
                .status(Amizade.StatusAmizade.PENDENTE)
                .criadoEm(System.currentTimeMillis())
                .atualizadoEm(System.currentTimeMillis())
                .build();

        amizade = amizadeRepository.save(amizade);

        notificacaoRepository.save(Notificacao.builder()
                .userId(receptor.getId())
                .tipo(Notificacao.TipoNotificacao.AMIZADE_RECEBIDA)
                .referenciaId(amizade.getId())
                .remetenteId(solicitanteId)
                .remetenteNome(solicitante.getNome())
                .remetenteUsername(solicitante.getUsername())
                .mensagem(solicitante.getNome() + " (@" + solicitante.getUsername() + ") quer ser seu amigo!")
                .lida(false)
                .criadoEm(System.currentTimeMillis())
                .build());

        log.info("Solicitação de amizade: {} → {}", solicitanteId, receptor.getId());
        return AmizadeResponseDTO.from(amizade);
    }

    public AmizadeResponseDTO aceitar(String amizadeId, String userId) {
        Amizade amizade = getAmizade(amizadeId);

        if (!amizade.getReceptorId().equals(userId)) {
            throw new IllegalArgumentException("Apenas o receptor pode aceitar");
        }
        if (amizade.getStatus() != Amizade.StatusAmizade.PENDENTE) {
            throw new IllegalArgumentException("Solicitação não está pendente");
        }

        amizade.setStatus(Amizade.StatusAmizade.ACEITA);
        amizade.setAtualizadoEm(System.currentTimeMillis());
        amizade = amizadeRepository.save(amizade);

        notificacaoRepository.save(Notificacao.builder()
                .userId(amizade.getSolicitanteId())
                .tipo(Notificacao.TipoNotificacao.AMIZADE_ACEITA)
                .referenciaId(amizadeId)
                .remetenteId(userId)
                .remetenteNome(amizade.getReceptorNome())
                .remetenteUsername(amizade.getReceptorUsername())
                .mensagem(amizade.getReceptorNome() + " (@" + amizade.getReceptorUsername() + ") aceitou sua solicitação de amizade!")
                .lida(false)
                .criadoEm(System.currentTimeMillis())
                .build());

        return AmizadeResponseDTO.from(amizade);
    }

    public AmizadeResponseDTO recusar(String amizadeId, String userId) {
        Amizade amizade = getAmizade(amizadeId);

        if (!amizade.getReceptorId().equals(userId)) {
            throw new IllegalArgumentException("Apenas o receptor pode recusar");
        }

        amizade.setStatus(Amizade.StatusAmizade.RECUSADA);
        amizade.setAtualizadoEm(System.currentTimeMillis());
        return AmizadeResponseDTO.from(amizadeRepository.save(amizade));
    }

    public List<AmizadeResponseDTO> listarAmigos(String userId) {
        return amizadeRepository.findAmizadesAceitas(userId).stream()
                .map(AmizadeResponseDTO::from)
                .collect(Collectors.toList());
    }

    public List<AmizadeResponseDTO> listarPendentes(String userId) {
        return amizadeRepository.findByReceptorIdAndStatus(userId, Amizade.StatusAmizade.PENDENTE).stream()
                .map(AmizadeResponseDTO::from)
                .collect(Collectors.toList());
    }

    public void remover(String amizadeId, String userId) {
        Amizade amizade = getAmizade(amizadeId);
        boolean ehParte = amizade.getSolicitanteId().equals(userId) || amizade.getReceptorId().equals(userId);
        if (!ehParte) {
            throw new IllegalArgumentException("Acesso negado");
        }
        amizadeRepository.deleteById(amizadeId);
        log.info("Amizade {} removida por {}", amizadeId, userId);
    }

    private Amizade getAmizade(String id) {
        return amizadeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada"));
    }
}
