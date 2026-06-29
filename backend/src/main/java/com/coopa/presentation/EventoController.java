package com.coopa.presentation;

import com.coopa.application.evento.EventoService;
import com.coopa.application.evento.dto.EventoRequestDTO;
import com.coopa.application.evento.dto.EventoResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@RequiredArgsConstructor
@Tag(name = "Eventos")
@SecurityRequirement(name = "bearerAuth")
public class EventoController {

    private final EventoService eventoService;

    @Operation(summary = "Listar todos os eventos ativos")
    @GetMapping
    public ResponseEntity<List<EventoResponseDTO>> listar(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(eventoService.listarAtivos(userDetails.getUsername()));
    }

    @Operation(summary = "Criar evento")
    @PostMapping
    public ResponseEntity<EventoResponseDTO> criar(
            @Valid @RequestBody EventoRequestDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(eventoService.criar(dto, userDetails.getUsername()));
    }

    @Operation(summary = "Detalhes de um evento")
    @GetMapping("/{id}")
    public ResponseEntity<EventoResponseDTO> buscar(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(eventoService.buscarPorId(id, userDetails.getUsername()));
    }

    @Operation(summary = "Editar evento (apenas organizador)")
    @PutMapping("/{id}")
    public ResponseEntity<EventoResponseDTO> editar(
            @PathVariable String id,
            @Valid @RequestBody EventoRequestDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(eventoService.editar(id, dto, userDetails.getUsername()));
    }

    @Operation(summary = "Cancelar evento (apenas organizador)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelar(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        eventoService.cancelar(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Compartilhar evento com um amigo")
    @PostMapping("/{id}/compartilhar")
    public ResponseEntity<Void> compartilhar(
            @PathVariable String id,
            @RequestBody java.util.Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        String destinatarioId = body.get("destinatarioId");
        if (destinatarioId == null || destinatarioId.isBlank()) {
            throw new IllegalArgumentException("destinatarioId é obrigatório");
        }
        eventoService.compartilhar(id, destinatarioId, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}
