package de.thm.swtp.api.userprofile.dto;

import lombok.Builder;

@Builder
public record UserProfileResponse(
        String keycloakId,
        String username,
        String email,
        String title,
        String location,
        int followers,
        String about,
        String experience
) {}
