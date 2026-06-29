package com.coopa.presentation;

import com.coopa.application.inscricao.InscricaoService;
import com.coopa.application.inscricao.dto.InscricaoResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos/{eventoId}/inscricao")
@RequiredArgsConstructor
@Tag(name = "Inscrições")
@SecurityRequirement(name = "bearerAuth")
public class InscricaoController {

    private final InscricaoService inscricaoService;

    @Operation(summary = "Confirmar presença")
    @PostMapping
    public ResponseEntity<InscricaoResponseDTO> confirmar(
            @PathVariable String eventoId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(inscricaoService.confirmar(eventoId, userDetails.getUsername()));
    }

    @Operation(summary = "Cancelar presença")
    @DeleteMapping
    public ResponseEntity<Void> cancelar(
            @PathVariable String eventoId,
            @AuthenticationPrincipal UserDetails userDetails) {
        inscricaoService.cancelar(eventoId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Listar inscritos")
    @GetMapping("/lista")
    public ResponseEntity<List<InscricaoResponseDTO>> listar(@PathVariable String eventoId) {
        return ResponseEntity.ok(inscricaoService.listar(eventoId));
    }
}
