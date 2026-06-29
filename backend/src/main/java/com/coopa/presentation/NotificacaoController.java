package com.coopa.presentation;

import com.coopa.application.notificacao.NotificacaoService;
import com.coopa.application.notificacao.dto.NotificacaoResponseDTO;
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
@RequestMapping("/api/notificacoes")
@RequiredArgsConstructor
@Tag(name = "Notificações")
@SecurityRequirement(name = "bearerAuth")
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    @Operation(summary = "Listar notificações do usuário logado")
    @GetMapping
    public ResponseEntity<List<NotificacaoResponseDTO>> listar(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(notificacaoService.listar(userDetails.getUsername()));
    }

    @Operation(summary = "Contar não lidas")
    @GetMapping("/nao-lidas")
    public ResponseEntity<Map<String, Long>> contarNaoLidas(
            @AuthenticationPrincipal UserDetails userDetails) {
        long count = notificacaoService.contarNaoLidas(userDetails.getUsername());
        return ResponseEntity.ok(Map.of("total", count));
    }

    @Operation(summary = "Marcar notificação como lida")
    @PutMapping("/{id}/ler")
    public ResponseEntity<Void> marcarComoLida(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        notificacaoService.marcarComoLida(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Marcar todas como lidas")
    @PutMapping("/ler-todas")
    public ResponseEntity<Void> marcarTodasComoLidas(
            @AuthenticationPrincipal UserDetails userDetails) {
        notificacaoService.marcarTodasComoLidas(userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Excluir notificação")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        notificacaoService.excluir(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Excluir todas as notificações")
    @DeleteMapping
    public ResponseEntity<Void> excluirTodas(
            @AuthenticationPrincipal UserDetails userDetails) {
        notificacaoService.excluirTodas(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
