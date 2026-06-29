package com.coopa.presentation;

import com.coopa.application.auth.AuthService;
import com.coopa.application.auth.dto.UpdateProfileRequestDTO;
import com.coopa.domain.auth.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Usuários")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final AuthService authService;

    @Operation(summary = "Dados do usuário logado")
    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getById(userDetails.getUsername());
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "nome", user.getNome(),
                "username", user.getUsername() != null ? user.getUsername() : "",
                "email", user.getEmail(),
                "avatarUrl", user.getAvatarUrl() != null ? user.getAvatarUrl() : "",
                "criadoEm", user.getCriadoEm()
        ));
    }

    @Operation(summary = "Atualizar perfil")
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequestDTO dto) {
        User user = authService.updateProfile(userDetails.getUsername(), dto);
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "nome", user.getNome(),
                "username", user.getUsername() != null ? user.getUsername() : "",
                "email", user.getEmail(),
                "avatarUrl", user.getAvatarUrl() != null ? user.getAvatarUrl() : ""
        ));
    }

    @Operation(summary = "Excluir conta (requer senha)")
    @DeleteMapping("/me")
    public ResponseEntity<Void> excluirConta(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        String senha = body.get("senha");
        if (senha == null || senha.isBlank()) {
            throw new IllegalArgumentException("Senha é obrigatória para excluir a conta");
        }
        authService.excluirConta(userDetails.getUsername(), senha);
        return ResponseEntity.noContent().build();
    }
}
