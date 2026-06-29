package com.coopa.application.mural.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MensagemRequestDTO(
    @NotBlank @Size(max = 500) String conteudo
) {}
