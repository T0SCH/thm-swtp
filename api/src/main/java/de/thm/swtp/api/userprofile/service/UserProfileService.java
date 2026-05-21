package de.thm.swtp.api.userprofile.service;

import de.thm.swtp.api.userprofile.dto.UserProfileRequest;
import de.thm.swtp.api.userprofile.dto.UserProfileResponse;
import de.thm.swtp.api.userprofile.entity.UserProfile;
import de.thm.swtp.api.userprofile.repository.UserProfileRepository;
import de.thm.swtp.api.users.entity.User;
import de.thm.swtp.api.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String userId) {
        User user = findUserOrThrow(userId);
        UserProfile profile = findProfileOrThrow(user);
        return toResponse(profile);
    }

    @Transactional
    public UserProfileResponse updateProfile(String userId, UserProfileRequest request) {
        User user = findUserOrThrow(userId);
        UserProfile profile = findProfileOrThrow(user);

        profile.setAbout(request.about());
        profile.setExperience(request.experience());

        return toResponse(userProfileRepository.save(profile));
    }

    @Transactional
    public void deleteProfile(String userId) {
        User user = findUserOrThrow(userId);
        UserProfile profile = findProfileOrThrow(user);
        userProfileRepository.delete(profile);
    }

    private User findUserOrThrow(String userId) {
        return userRepository.findByKeycloakId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private UserProfile findProfileOrThrow(User user) {
        return userProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
    }

    private UserProfileResponse toResponse(UserProfile profile) {
        return UserProfileResponse.builder()
                .userId(profile.getUser().getKeycloakId())
                .about(profile.getAbout())
                .experience(profile.getExperience())
                .build();
    }
}
