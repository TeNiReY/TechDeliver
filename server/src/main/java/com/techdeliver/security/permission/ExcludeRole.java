package com.techdeliver.security.permission;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Аннотация для запрета доступа пользователям с определенными ролями.
 * Это алиас для @RequireRole с mode = NONE для удобства использования.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ExcludeRole {
    String[] value();  // массив ролей, которые НЕ должны иметь доступ
}
