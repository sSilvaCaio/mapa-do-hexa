package com.coopa.application.evento;

import com.coopa.application.auth.AuthService;
import com.coopa.application.evento.dto.EventoRequestDTO;
import com.coopa.application.evento.dto.EventoResponseDTO;
import com.coopa.domain.amizade.Amizade;
import com.coopa.domain.amizade.AmizadeRepository;
import com.coopa.domain.auth.User;
import com.coopa.domain.evento.Evento;
import com.coopa.domain.evento.EventoCompartilhado;
import com.coopa.domain.evento.EventoCompartilhadoRepository;
import com.coopa.domain.evento.EventoRepository;
import com.coopa.domain.inscricao.InscricaoRepository;
import com.coopa.domain.notificacao.Notificacao;
import com.coopa.domain.notificacao.NotificacaoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventoService {

    private final EventoRepository eventoRepository;
    private final InscricaoRepository inscricaoRepository;
    private final EventoCompartilhadoRepository compartilhadoRepository;
    private final AmizadeRepository amizadeRepository;
    private final NotificacaoRepository notificacaoRepository;
    private final AuthService authService;

    public List<EventoResponseDTO> listarAtivos(String userId) {
        List<Evento> ativos = eventoRepository.findByAtivoTrueOrderByCriadoEmDesc();

        // Mapear quais eventos foram compartilhados com este usuário
        Map<String, String> compartilhadosPorMim = new HashMap<>();
        if (userId != null) {
            compartilhadoRepository.findByDestinatarioId(userId).forEach(c ->
                    compartilhadosPorMim.put(c.getEventoId(), c.getRemetenteNome()));
        }

        // Converter para DTO, marcando compartilhados
        List<EventoResponseDTO> result = ativos.stream()
                .map(e -> toDTOCompartilhado(e, userId, compartilhadosPorMim))
                .collect(Collectors.toList());

        // Ordenar: compartilhados primeiro, depois por data de criação desc
        result.sort((a, b) -> {
            if (a.compartilhadoComigo() && !b.compartilhadoComigo()) return -1;
            if (!a.compartilhadoComigo() && b.compartilhadoComigo()) return 1;
            return Long.compare(b.criadoEm() != null ? b.criadoEm() : 0,
                                a.criadoEm() != null ? a.criadoEm() : 0);
        });

        return result;
    }

    public EventoResponseDTO buscarPorId(String id, String userId) {
        Evento evento = getEvento(id);
        return toDTO(evento, userId);
    }

    public EventoResponseDTO criar(EventoRequestDTO dto, String userId) {
        User user = authService.getById(userId);

        Evento evento = Evento.builder()
                .organizadorId(userId)
                .organizadorNome(user.getNome())
                .titulo(dto.titulo())
                .jogo(dto.jogo())
                .data(dto.data())
                .horario(dto.horario())
                .nomeLocal(dto.nomeLocal())
                .endereco(dto.endereco())
                .lat(dto.lat())
                .lng(dto.lng())
                .descricao(dto.descricao())
                .oQueLevar(dto.oQueLevar())
                .infraestrutura(dto.infraestrutura())
                .maxParticipantes(dto.maxParticipantes())
                .totalInscritos(0)
                .criadoEm(System.currentTimeMillis())
                .ativo(true)
                .build();

        evento = eventoRepository.save(evento);
        log.info("Evento criado: {} por {}", evento.getTitulo(), userId);
        return toDTO(evento, userId);
    }

    public EventoResponseDTO editar(String id, EventoRequestDTO dto, String userId) {
        Evento evento = getEvento(id);

        if (!evento.getOrganizadorId().equals(userId)) {
            throw new IllegalArgumentException("Apenas o organizador pode editar o evento");
        }

        evento.setTitulo(dto.titulo());
        evento.setJogo(dto.jogo());
        evento.setData(dto.data());
        evento.setHorario(dto.horario());
        evento.setNomeLocal(dto.nomeLocal());
        evento.setEndereco(dto.endereco());
        evento.setLat(dto.lat());
        evento.setLng(dto.lng());
        evento.setDescricao(dto.descricao());
        evento.setOQueLevar(dto.oQueLevar());
        evento.setInfraestrutura(dto.infraestrutura());
        evento.setMaxParticipantes(dto.maxParticipantes());

        return toDTO(eventoRepository.save(evento), userId);
    }

    public void cancelar(String id, String userId) {
        Evento evento = getEvento(id);

        if (!evento.getOrganizadorId().equals(userId)) {
            throw new IllegalArgumentException("Apenas o organizador pode cancelar o evento");
        }

        evento.setAtivo(false);
        eventoRepository.save(evento);

        // Notificar todos os participantes confirmados
        List<com.coopa.domain.inscricao.Inscricao> inscritos =
                inscricaoRepository.findByEventoIdAndAtivaTrue(id);

        User organizador = authService.getById(userId);
        long agora = System.currentTimeMillis();

        List<Notificacao> notifs = inscritos.stream()
                .filter(i -> !i.getUserId().equals(userId))
                .map(i -> Notificacao.builder()
                        .userId(i.getUserId())
                        .tipo(Notificacao.TipoNotificacao.EVENTO_CANCELADO)
                        .referenciaId(id)
                        .remetenteId(userId)
                        .remetenteNome(organizador.getNome())
                        .mensagem("O evento \"" + evento.getTitulo() + "\" foi cancelado pelo organizador.")
                        .lida(false)
                        .criadoEm(agora)
                        .build())
                .collect(Collectors.toList());

        notificacaoRepository.saveAll(notifs);
        log.info("Evento cancelado: {} — {} participantes notificados", id, notifs.size());
    }

    public void incrementarInscritos(String eventoId) {
        Evento evento = getEvento(eventoId);
        evento.setTotalInscritos(evento.getTotalInscritos() + 1);
        eventoRepository.save(evento);
    }

    public void decrementarInscritos(String eventoId) {
        Evento evento = getEvento(eventoId);
        int atual = evento.getTotalInscritos() == null ? 0 : evento.getTotalInscritos();
        evento.setTotalInscritos(Math.max(0, atual - 1));
        eventoRepository.save(evento);
    }

    private Evento getEvento(String id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));
    }

    public void compartilhar(String eventoId, String destinatarioId, String remetenteId) {
        Evento evento = getEvento(eventoId);
        if (!evento.isAtivo()) {
            throw new IllegalArgumentException("Evento não está ativo");
        }

        // Verificar amizade
        amizadeRepository.findByPar(remetenteId, destinatarioId)
                .filter(a -> a.getStatus() == Amizade.StatusAmizade.ACEITA)
                .orElseThrow(() -> new IllegalArgumentException("Vocês precisam ser amigos para compartilhar eventos"));

        if (compartilhadoRepository.existsByEventoIdAndDestinatarioId(eventoId, destinatarioId)) {
            throw new IllegalArgumentException("Evento já foi compartilhado com este amigo");
        }

        User remetente = authService.getById(remetenteId);

        EventoCompartilhado compartilhado = EventoCompartilhado.builder()
                .eventoId(eventoId)
                .remetenteId(remetenteId)
                .remetenteNome(remetente.getNome())
                .destinatarioId(destinatarioId)
                .criadoEm(System.currentTimeMillis())
                .build();
        compartilhadoRepository.save(compartilhado);

        notificacaoRepository.save(Notificacao.builder()
                .userId(destinatarioId)
                .tipo(Notificacao.TipoNotificacao.EVENTO_COMPARTILHADO)
                .referenciaId(eventoId)
                .remetenteId(remetenteId)
                .remetenteNome(remetente.getNome())
                .mensagem(remetente.getNome() + " compartilhou o evento \"" + evento.getTitulo() + "\" com você!")
                .lida(false)
                .criadoEm(System.currentTimeMillis())
                .build());

        log.info("Evento {} compartilhado por {} com {}", eventoId, remetenteId, destinatarioId);
    }

    private EventoResponseDTO toDTO(Evento e, String userId) {
        return toDTOCompartilhado(e, userId, new HashMap<>());
    }

    private EventoResponseDTO toDTOCompartilhado(Evento e, String userId, Map<String, String> compartilhadosPor) {
        boolean inscrito = userId != null &&
                inscricaoRepository.findByEventoIdAndUserId(e.getId(), userId)
                        .map(i -> i.isAtiva())
                        .orElse(false);

        String compartilhadoPor = compartilhadosPor.get(e.getId());

        return new EventoResponseDTO(
                e.getId(), e.getOrganizadorId(), e.getOrganizadorNome(),
                e.getTitulo(), e.getJogo(), e.getData(), e.getHorario(),
                e.getNomeLocal(), e.getEndereco(), e.getLat(), e.getLng(),
                e.getDescricao(), e.getOQueLevar(), e.getInfraestrutura(),
                e.getMaxParticipantes(), e.getTotalInscritos(), inscrito,
                e.getCriadoEm(),
                compartilhadoPor != null,
                compartilhadoPor
        );
    }
}
