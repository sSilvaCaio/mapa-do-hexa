package com.coopa.application.mural;

import com.coopa.application.mural.dto.MensagemRequestDTO;
import com.coopa.application.mural.dto.MensagemResponseDTO;
import com.coopa.domain.auth.UserRepository;
import com.coopa.domain.evento.EventoRepository;
import com.coopa.domain.mural.MensagemMural;
import com.coopa.domain.mural.MuralRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MuralService {

    private final MuralRepository muralRepository;
    private final EventoRepository eventoRepository;
    private final UserRepository userRepository;

    public List<MensagemResponseDTO> listar(String eventoId) {
        return muralRepository.findByEventoIdOrderByCriadoEmAsc(eventoId).stream()
                .map(this::toDTO)
                .toList();
    }

    public MensagemResponseDTO publicar(String eventoId, String userId, MensagemRequestDTO dto) {
        var evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));

        String autorNome = userRepository.findById(userId)
                .map(u -> u.getNome())
                .orElse("Usuário");

        boolean ehOrganizador = evento.getOrganizadorId().equals(userId);

        MensagemMural msg = MensagemMural.builder()
                .eventoId(eventoId)
                .autorId(userId)
                .autorNome(autorNome)
                .conteudo(dto.conteudo())
                .ehOrganizador(ehOrganizador)
                .criadoEm(System.currentTimeMillis())
                .build();

        return toDTO(muralRepository.save(msg));
    }

    public void excluir(String eventoId, String mensagemId, String userId) {
        MensagemMural msg = muralRepository.findById(mensagemId)
                .orElseThrow(() -> new IllegalArgumentException("Mensagem não encontrada"));

        if (!msg.getEventoId().equals(eventoId)) {
            throw new IllegalArgumentException("Mensagem não pertence a este evento");
        }

        var evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));

        boolean ehAutor = msg.getAutorId().equals(userId);
        boolean ehOrganizador = evento.getOrganizadorId().equals(userId);

        if (!ehAutor && !ehOrganizador) {
            throw new IllegalArgumentException("Apenas o autor ou o organizador podem excluir esta mensagem");
        }

        muralRepository.deleteById(mensagemId);
    }

    private MensagemResponseDTO toDTO(MensagemMural m) {
        return new MensagemResponseDTO(m.getId(), m.getEventoId(), m.getAutorId(),
                m.getAutorNome(), m.getConteudo(), m.isEhOrganizador(), m.getCriadoEm());
    }
}
