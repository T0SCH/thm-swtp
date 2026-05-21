package de.thm.swtp.api.userprofile.dto;

import lombok.Builder;

@Builder
public record UserProfileResponse(
        String userId,
        String about,
        String experience
) {}
