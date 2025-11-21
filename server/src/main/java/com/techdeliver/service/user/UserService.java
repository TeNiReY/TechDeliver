package com.techdeliver.service.user;

import com.techdeliver.dto.UserDto;
import com.techdeliver.entity.ProductEntity;
import com.techdeliver.entity.UserEntity;
import com.techdeliver.exception.AlreadyExistsException;
import com.techdeliver.exception.InvalidCredentialsException;
import com.techdeliver.exception.ResourceNotFoundException;
import com.techdeliver.repository.RoleRepository;
import com.techdeliver.repository.UserRepository;
import com.techdeliver.request.RegisterRequest;
import com.techdeliver.service.product.IProductService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final IProductService productService;
    private final RoleRepository roleRepository;

    private final ModelMapper modelMapper;

    @Override
    public UserEntity getUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(()
                        -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    @Override
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

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
                    userEntity.addRole(roleRepository.findByName("USER"));
                    return userRepository.save(userEntity);
                }).orElseThrow(() ->
                        new AlreadyExistsException("User with the same credentials already exists!"));
    }

    @Override
    public UserEntity updateUsername(UUID userId, String newUsername) { //make this as a transaction
        return Optional.ofNullable(getUserById(userId))
                .map(u -> {
                    if (!u.getUsername().equals(newUsername) &&
                            !userRepository.existsByUsername(newUsername)) {
                        u.setUsername(newUsername);
                        return userRepository.save(u);
                    } else {
                        throw new AlreadyExistsException("User with the same username already exists!");
                    }
                }).orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + userId)); //TODO: check logic here
    }

    @Override
    public UserEntity updatePassword(UUID userId, String oldPassword, String newPassword) {
        return Optional.ofNullable(getUserById(userId))
                .map(u -> {
                    if (!passwordEncoder.matches(oldPassword, u.getPassword())) {
                        throw new InvalidCredentialsException("Invalid password!");
                    }

                    u.setPassword(passwordEncoder.encode(newPassword));
                    return userRepository.save(u);
                }).orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + userId)); //TODO: check logic here
    }

//    @Override
    public boolean setDeliveryAddress(UUID userId, String address) {
        return Optional.ofNullable(getUserById(userId))
                .map(u -> {
                    u.setSavedDeliveryAddress(address);
                    userRepository.save(u);
                    return true;
                }).orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + userId));
    }

    @Override
    public Set<ProductEntity> getUserSavedProducts(UUID userId) {
        return Optional.ofNullable(getUserById(userId))
                .map(UserEntity::getSavedProducts).orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + userId));
    }

    @Override
    public ProductEntity saveProduct(UUID productId, UUID userId) {
        var product = productService.getProductById(productId);

        var user = getUserById(userId);

        user.addSavedProduct(product);
        userRepository.save(user);
        return product;
    }

    @Override
    public ProductEntity unsaveProduct(UUID productId, UUID userId) {
        var product = productService.getProductById(productId);

        var user = getUserById(userId);

        user.getSavedProducts().remove(product);
        userRepository.save(user);
        return product;
    }


    @Override
    public List<UserDto> getConvertedUsers(List<UserEntity> users) {
        return users.stream().map(this::convertToDto).toList();
    }

    @Override
    public UserDto convertToDto(UserEntity user) {
        UserDto userDto = new UserDto();
        userDto.setUserId(user.getUserId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setSavedDeliveryAddress(user.getSavedDeliveryAddress());
        userDto.addUserRoles(user.getRoles());
        // Не включаем cart и roles пока что, чтобы избежать ошибок
        return userDto;
    }


}
