package com.coopa.application.notificacao;

import com.coopa.application.notificacao.dto.NotificacaoResponseDTO;
import com.coopa.domain.notificacao.Notificacao;
import com.coopa.domain.notificacao.NotificacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;

    public List<NotificacaoResponseDTO> listar(String userId) {
        return notificacaoRepository.findByUserIdOrderByCriadoEmDesc(userId).stream()
                .map(NotificacaoResponseDTO::from)
                .collect(Collectors.toList());
    }

    public long contarNaoLidas(String userId) {
        return notificacaoRepository.countByUserIdAndLidaFalse(userId);
    }

    public void marcarComoLida(String notificacaoId, String userId) {
        Notificacao n = notificacaoRepository.findById(notificacaoId)
                .orElseThrow(() -> new IllegalArgumentException("Notificação não encontrada"));
        if (!n.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Acesso negado");
        }
        n.setLida(true);
        notificacaoRepository.save(n);
    }

    public void marcarTodasComoLidas(String userId) {
        List<Notificacao> naoLidas = notificacaoRepository.findByUserIdOrderByCriadoEmDesc(userId)
                .stream().filter(n -> !n.isLida()).collect(Collectors.toList());
        naoLidas.forEach(n -> n.setLida(true));
        notificacaoRepository.saveAll(naoLidas);
    }

    public void excluir(String notificacaoId, String userId) {
        Notificacao n = notificacaoRepository.findById(notificacaoId)
                .orElseThrow(() -> new IllegalArgumentException("Notificação não encontrada"));
        if (!n.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Acesso negado");
        }
        notificacaoRepository.deleteById(notificacaoId);
    }

    public void excluirTodas(String userId) {
        List<Notificacao> todas = notificacaoRepository.findByUserIdOrderByCriadoEmDesc(userId);
        notificacaoRepository.deleteAll(todas);
    }
}
