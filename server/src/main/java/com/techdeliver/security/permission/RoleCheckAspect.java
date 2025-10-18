package com.techdeliver.security.permission;

import com.techdeliver.exception.PermissionDeniedException;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.nio.file.AccessDeniedException;
import java.util.Arrays;

@Aspect
@Component
@RequiredArgsConstructor
public class RoleCheckAspect {

    @Around("@annotation(requireRole)")
    public Object checkRole(ProceedingJoinPoint joinPoint, RequireRole requireRole) throws Throwable {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new PermissionDeniedException("User is not authenticated");
        }

        boolean hasRole = Arrays.stream(requireRole.value())
                .anyMatch(role -> authentication.getAuthorities()
                        .stream()
                        .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + role)));

        if (!hasRole) {
            throw new PermissionDeniedException("User does not have required role: " + Arrays.toString(requireRole.value()));
        }

        return joinPoint.proceed();
    }
}
