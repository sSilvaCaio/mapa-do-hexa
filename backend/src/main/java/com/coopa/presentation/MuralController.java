package com.coopa.presentation;

import com.coopa.application.mural.MuralService;
import com.coopa.application.mural.dto.MensagemRequestDTO;
import com.coopa.application.mural.dto.MensagemResponseDTO;
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
@RequestMapping("/api/eventos/{eventoId}/mural")
@RequiredArgsConstructor
@Tag(name = "Mural")
@SecurityRequirement(name = "bearerAuth")
public class MuralController {

    private final MuralService muralService;

    @Operation(summary = "Listar mensagens do mural")
    @GetMapping
    public ResponseEntity<List<MensagemResponseDTO>> listar(@PathVariable String eventoId) {
        return ResponseEntity.ok(muralService.listar(eventoId));
    }

    @Operation(summary = "Publicar mensagem no mural")
    @PostMapping
    public ResponseEntity<MensagemResponseDTO> publicar(
            @PathVariable String eventoId,
            @Valid @RequestBody MensagemRequestDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(muralService.publicar(eventoId, userDetails.getUsername(), dto));
    }

    @Operation(summary = "Excluir mensagem do mural (autor ou organizador)")
    @DeleteMapping("/{mensagemId}")
    public ResponseEntity<Void> excluir(
            @PathVariable String eventoId,
            @PathVariable String mensagemId,
            @AuthenticationPrincipal UserDetails userDetails) {
        muralService.excluir(eventoId, mensagemId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
