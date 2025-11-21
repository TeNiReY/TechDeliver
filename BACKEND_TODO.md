# Необходимо добавить на бэкенде

## Для работы управления заказами в админ-панели

### 1. Добавить в `order.graphqls`:

```graphql
extend type Query {
    getUserOrders(userId: ID!): [OrderDto]
    
    # НОВОЕ: Получение всех заказов для админа
    getAllOrders: [OrderDto]
}

extend type Mutation {
    placeOrder(input: PlaceOrderInput!): OrderDto
    calculateOrderPreview(input: PlaceOrderInput!): OrderInfoDto
    
    # НОВОЕ: Изменение статуса заказа
    updateOrderStatus(orderId: ID!, status: String!): OrderDto
}
```

### 2. Реализовать методы в контроллере:

**getAllOrders()** - возвращает все заказы в системе (только для админов)

**updateOrderStatus(orderId, status)** - обновляет статус заказа

### 3. Статусы заказов (уже есть в OrderStatus.java):
- PENDING - Ожидает
- PROCESSING - В обработке  
- SHIPPED - Отправлен
- DELIVERED - Доставлен
- CANCELLED - Отменен

### 4. Логика переходов между статусами:

**Правила:**
- PENDING → PROCESSING или CANCELLED
- PROCESSING → SHIPPED или CANCELLED
- SHIPPED → DELIVERED или CANCELLED
- DELIVERED → (финальный статус, изменить нельзя)
- CANCELLED → (финальный статус, изменить нельзя)

**Важно:**
- Нельзя вернуться к предыдущему статусу
- Отменить можно только заказы в статусах PENDING, PROCESSING, SHIPPED
- Доставленный заказ отменить нельзя

### 5. Проверка прав доступа:
Убедитесь, что методы `getAllOrders` и `updateOrderStatus` доступны только пользователям с ролью ADMIN.

### 6. Валидация на бэкенде:
Рекомендуется добавить проверку допустимых переходов между статусами в методе `updateOrderStatus`.
