package com.techdeliver.security.permission;

public enum RoleCheckMode {
    ANY,  // Пользователь должен иметь ХОТЯ БЫ ОДНУ из указанных ролей (по умолчанию)
    ALL,  // Пользователь должен иметь ВСЕ указанные роли
    NONE  // Пользователь НЕ должен иметь НИ ОДНОЙ из указанных ролей
}
