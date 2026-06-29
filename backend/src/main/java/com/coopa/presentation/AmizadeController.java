package com.coopa.presentation;

import com.coopa.application.amizade.AmizadeService;
import com.coopa.application.amizade.dto.AmizadeResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/amizades")
@RequiredArgsConstructor
@Tag(name = "Amizades")
@SecurityRequirement(name = "bearerAuth")
public class AmizadeController {

    private final AmizadeService amizadeService;

    @Operation(summary = "Listar amigos (solicitações aceitas)")
    @GetMapping
    public ResponseEntity<List<AmizadeResponseDTO>> listarAmigos(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(amizadeService.listarAmigos(userDetails.getUsername()));
    }

    @Operation(summary = "Listar solicitações pendentes recebidas")
    @GetMapping("/pendentes")
    public ResponseEntity<List<AmizadeResponseDTO>> listarPendentes(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(amizadeService.listarPendentes(userDetails.getUsername()));
    }

    @Operation(summary = "Enviar solicitação de amizade por username")
    @PostMapping("/solicitar")
    public ResponseEntity<AmizadeResponseDTO> solicitar(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = body.get("username");
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("username é obrigatório");
        }
        return ResponseEntity.ok(amizadeService.solicitar(userDetails.getUsername(), username));
    }

    @Operation(summary = "Aceitar solicitação de amizade")
    @PutMapping("/{id}/aceitar")
    public ResponseEntity<AmizadeResponseDTO> aceitar(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(amizadeService.aceitar(id, userDetails.getUsername()));
    }

    @Operation(summary = "Recusar solicitação de amizade")
    @PutMapping("/{id}/recusar")
    public ResponseEntity<AmizadeResponseDTO> recusar(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(amizadeService.recusar(id, userDetails.getUsername()));
    }

    @Operation(summary = "Remover amigo")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        amizadeService.remover(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
