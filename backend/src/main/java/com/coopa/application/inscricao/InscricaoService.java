package com.coopa.application.inscricao;

import com.coopa.application.evento.EventoService;
import com.coopa.application.inscricao.dto.InscricaoResponseDTO;
import com.coopa.domain.auth.UserRepository;
import com.coopa.domain.evento.Evento;
import com.coopa.domain.evento.EventoRepository;
import com.coopa.domain.inscricao.Inscricao;
import com.coopa.domain.inscricao.InscricaoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class InscricaoService {

    private final InscricaoRepository inscricaoRepository;
    private final EventoRepository eventoRepository;
    private final UserRepository userRepository;
    private final EventoService eventoService;

    public InscricaoResponseDTO confirmar(String eventoId, String userId) {
        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));

        if (!evento.isAtivo()) {
            throw new IllegalArgumentException("Evento cancelado");
        }

        if (evento.getMaxParticipantes() != null &&
                evento.getTotalInscritos() >= evento.getMaxParticipantes()) {
            throw new IllegalArgumentException("Evento lotado");
        }

        var existente = inscricaoRepository.findByEventoIdAndUserId(eventoId, userId);
        if (existente.isPresent()) {
            Inscricao ins = existente.get();
            if (ins.isAtiva()) {
                throw new IllegalArgumentException("Usuário já está inscrito");
            }
            ins.setAtiva(true);
            ins = inscricaoRepository.save(ins);
            eventoService.incrementarInscritos(eventoId);
            return toDTO(ins);
        }

        String userNome = userRepository.findById(userId)
                .map(u -> u.getNome())
                .orElse("Usuário");

        Inscricao inscricao = Inscricao.builder()
                .eventoId(eventoId)
                .userId(userId)
                .userNome(userNome)
                .criadoEm(System.currentTimeMillis())
                .ativa(true)
                .build();

        inscricao = inscricaoRepository.save(inscricao);
        eventoService.incrementarInscritos(eventoId);

        log.info("Inscrição confirmada: user={} evento={}", userId, eventoId);
        return toDTO(inscricao);
    }

    public void cancelar(String eventoId, String userId) {
        Inscricao inscricao = inscricaoRepository.findByEventoIdAndUserId(eventoId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Inscrição não encontrada"));

        if (!inscricao.isAtiva()) {
            throw new IllegalArgumentException("Inscrição já cancelada");
        }

        inscricao.setAtiva(false);
        inscricaoRepository.save(inscricao);
        eventoService.decrementarInscritos(eventoId);
        log.info("Inscrição cancelada: user={} evento={}", userId, eventoId);
    }

    public List<InscricaoResponseDTO> listar(String eventoId) {
        return inscricaoRepository.findByEventoIdAndAtivaTrue(eventoId).stream()
                .map(this::toDTO)
                .toList();
    }

    private InscricaoResponseDTO toDTO(Inscricao i) {
        return new InscricaoResponseDTO(i.getId(), i.getEventoId(), i.getUserId(), i.getUserNome(), i.getCriadoEm());
    }
}
