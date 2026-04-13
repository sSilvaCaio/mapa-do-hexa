package com.mapadohexa.mapa_hexa.microservices.userAuthenticator.presentation;

import com.mapadohexa.mapa_hexa.microservices.userAuthenticator.application.dto.AuthResponseDTO;
import com.mapadohexa.mapa_hexa.microservices.userAuthenticator.application.dto.LoginRequestDTO;
import com.mapadohexa.mapa_hexa.microservices.userAuthenticator.application.dto.RegisterRequestDTO;
import com.mapadohexa.mapa_hexa.microservices.userAuthenticator.application.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterRequestDTO request) {
        AuthResponseDTO response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO request) {
        AuthResponseDTO response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}

