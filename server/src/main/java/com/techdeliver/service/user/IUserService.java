package com.techdeliver.service.user;

import com.techdeliver.entity.UserEntity;
import com.techdeliver.request.RegisterRequest;

public interface IUserService {
    UserEntity createUserAccount(RegisterRequest request);
}
