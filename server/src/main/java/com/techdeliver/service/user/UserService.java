package com.techdeliver.service.user;

import com.techdeliver.entity.UserEntity;
import com.techdeliver.exception.AlreadyExistsException;
import com.techdeliver.repository.UserRepository;
import com.techdeliver.request.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public UserEntity createUserAccount(RegisterRequest request) {
        return Optional.of(request)
                .filter(user -> !userRepository
                        .existsByUsernameOrEmail(request.getUsername(),  request.getEmail()))
                .map(req -> {
                    var userEntity = new UserEntity();
                    userEntity.setUsername(request.getUsername());
                    userEntity.setEmail(request.getEmail());
                    userEntity.setPassword(passwordEncoder.encode(request.getPassword()));
                    return userRepository.save(userEntity);
                }).orElseThrow(() ->
                        new AlreadyExistsException("User with the same credentials already exists!"));
    }


}
