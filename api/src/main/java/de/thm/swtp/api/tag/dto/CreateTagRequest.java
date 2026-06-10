package de.thm.swtp.api.tag.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateTagRequest(@NotBlank @Size(max = 30)
                               @Pattern(regexp = "^[a-zA-Z0-9äöüÄÖÜß \\-.]+$", message = "Tag name contains invalid characters")
                               String name) {}
