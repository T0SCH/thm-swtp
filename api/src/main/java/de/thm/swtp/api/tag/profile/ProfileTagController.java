package de.thm.swtp.api.tag.profile;

import de.thm.swtp.api.tag.dto.AddProfileTagRequest;
import de.thm.swtp.api.tag.entity.Tag;
import de.thm.swtp.api.tool.OwnershipVerifier;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/profiles/{username}/tags")
@RequiredArgsConstructor
public class ProfileTagController {

    private final ProfileTagService profileTagService;

    @PostMapping
    public ResponseEntity<Tag> addTag(@PathVariable String username,
                                      @AuthenticationPrincipal Jwt jwt,
                                      @RequestBody AddProfileTagRequest request) {

        OwnershipVerifier.verify(username, jwt);

        return ResponseEntity.ok(
                profileTagService.addTagToProfile(username, request)
        );
    }
}
