package de.thm.swtp.api.tag.profile;


import de.thm.swtp.api.tag.TagRepository;
import de.thm.swtp.api.tag.dto.AddProfileTagRequest;
import de.thm.swtp.api.tag.entity.Tag;
import de.thm.swtp.api.userprofile.entity.UserProfile;
import de.thm.swtp.api.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileTagService {

    private final TagRepository tagRepository;
    private final UserProfileRepository userProfileRepository;

    @Transactional
    public Tag addTagToProfile(String username, AddProfileTagRequest request) {
        UserProfile profile = userProfileRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        String name = request.getName().trim();
        Tag tag = tagRepository.findByName(name)
                .orElseGet(() -> tagRepository.save(new Tag(name)));

        profile.getTags().add(tag);

        return tag;
    }
}
