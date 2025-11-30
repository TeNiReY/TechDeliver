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

    @Around("@annotation(excludeRole)")
    public Object checkExcludeRole(ProceedingJoinPoint joinPoint, ExcludeRole excludeRole) throws Throwable {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new PermissionDeniedException("User is not authenticated");
        }

        boolean hasForbiddenRole = Arrays.stream(excludeRole.value())
                .anyMatch(role -> hasAuthority(authentication, role));

        if (hasForbiddenRole) {
            throw new PermissionDeniedException("User has forbidden role(s): " + Arrays.toString(excludeRole.value()));
        }

        return joinPoint.proceed();
    }

    @Around("@annotation(requireRole)")
    public Object checkRole(ProceedingJoinPoint joinPoint, RequireRole requireRole) throws Throwable {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new PermissionDeniedException("User is not authenticated");
        }

        boolean hasAccess = checkRoleAccess(authentication, requireRole.value(), requireRole.mode());

        if (!hasAccess) {
            String message = buildErrorMessage(requireRole.value(), requireRole.mode());
            throw new PermissionDeniedException(message);
        }

        return joinPoint.proceed();
    }

    private boolean checkRoleAccess(Authentication authentication, String[] roles, RoleCheckMode mode) {
        return switch (mode) {
            case ANY -> // Хотя бы одна роль должна совпадать
                    Arrays.stream(roles)
                            .anyMatch(role -> hasAuthority(authentication, role));
            
            case ALL -> // Все роли должны совпадать
                    Arrays.stream(roles)
                            .allMatch(role -> hasAuthority(authentication, role));
            
            case NONE -> // Ни одна роль не должна совпадать
                    Arrays.stream(roles)
                            .noneMatch(role -> hasAuthority(authentication, role));
        };
    }

    private boolean hasAuthority(Authentication authentication, String role) {
        return authentication.getAuthorities()
                .stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + role));
    }

    private String buildErrorMessage(String[] roles, RoleCheckMode mode) {
        return switch (mode) {
            case ANY -> "User does not have any of required roles: " + Arrays.toString(roles);
            case ALL -> "User does not have all required roles: " + Arrays.toString(roles);
            case NONE -> "User has forbidden role(s): " + Arrays.toString(roles);
        };
    }
}
