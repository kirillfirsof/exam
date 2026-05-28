Отличная идея. Такой файл — твоя страховка на экзамене. Даже если интернет будет, иметь чёткий план перед глазами бесценно.

Вот полный конспект, разбитый на этапы.

---

# ШПАРГАЛКА ПО СОЗДАНИЮ КЛИЕНТ-СЕРВЕРНОГО ПРИЛОЖЕНИЯ

## ЭТАП 0: АУДИТ ОКРУЖЕНИЯ (2 минуты)

```bash
java -version          # Должна быть 17+
javac -version         # Проверить компилятор
psql --version         # Версия PostgreSQL
psql -U postgres       # Проверить подключение к БД
                       # Пароль: postgres (или спросить препода)
node -v                # Версия Node.js
npm -v                 # Версия npm
npx -v                 # Версия npx
mvn --version          # Если нет — использовать mvnw.cmd
```

### Создание базы данных
```sql
CREATE DATABASE exam_db;
\l                     # Проверить список баз
\q                     # Выйти
```

---

## ЭТАП 1: СОЗДАНИЕ SPRING BOOT ПРОЕКТА (5 минут)

### Через start.spring.io (если есть интернет)
1. Зайти на `https://start.spring.io`
2. Настройки:
   - Project: Maven
   - Language: Java
   - Spring Boot: **3.3.6** (надёжная!)
   - Java: та, что установлена (21, 17, 11)
   - Group: `com.example`
   - Artifact: `demo`
3. Зависимости (кнопка ADD DEPENDENCIES):
   - ✅ Spring Web
   - ✅ Spring Data JPA
   - ✅ PostgreSQL Driver
   - ✅ Lombok
   - ✅ Validation (для валидации)
   - ✅ Spring Security (для авторизации)
4. Скачать ZIP, распаковать в папку проекта

### Если Spring Boot 3.3.6 не работает со старой Java
- Java 8/11 → Spring Boot 2.7.18
- В pom.xml поправить `<java.version>` на нужную

---

## ЭТАП 2: НАСТРОЙКА ПРОЕКТА (3 минуты)

### pom.xml — проверить/добавить зависимости
```xml
<!-- Lombok должен быть первым -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>

<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>

<!-- Swagger -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.5.0</version>
</dependency>
```

### application.properties
```properties
spring.application.name=demo
server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/exam_db
spring.datasource.username=postgres
spring.datasource.password=postgres

spring.jpa.hibernate.ddl-auto=create
spring.jpa.show-sql=true
spring.jpa.defer-datasource-initialization=true
spring.sql.init.mode=always
```

### Первый запуск
```bash
cd папка_проекта
.\mvnw.cmd clean spring-boot:run
```
Должен увидеть `Started DemoApplication in ... seconds`.

---

## ЭТАП 3: СУЩНОСТИ (10 минут)

### Пакет `model`

```java
@Entity
@Table(name = "имя_таблицы")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ИмяСущности {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Поля с @Column
}
```

### Аннотации для связей

| Связь | Родитель | Ребёнок |
|-------|----------|---------|
| Один ко многим | `@OneToMany(mappedBy = "...")` | `@ManyToOne + @JoinColumn` |
| Многие ко многим | Через промежуточную таблицу | |
| Один к одному | `@OneToOne` на любой стороне | `@JoinColumn(unique = true)` |

### Важно
- `mappedBy` указывает имя поля в дочернем классе
- `@JsonIgnore` на обратных ссылках (если не используем DTO)
- `@Enumerated(EnumType.STRING)` для enum-полей
- `@Builder.Default` для полей с начальным значением

---

## ЭТАП 4: РЕПОЗИТОРИИ (3 минуты)

### Пакет `repository`

```java
public interface ИмяRepository extends JpaRepository<ИмяСущности, Long> {
    Optional<ИмяСущности> findByПоле(Тип поле);
    List<ИмяСущности> findByПолеContainingIgnoreCase(String поле);
    boolean existsByПоле(Тип поле);

    @Query("SELECT ... FROM ... WHERE ...")
    List<ИмяСущности> кастомныйМетод(@Param("параметр") Тип параметр);
}
```

---

## ЭТАП 5: СЕРВИСЫ (15 минут)

### Пакет `service`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class ИмяService {

    private final ИмяRepository repository;

    public ИмяDto create(ИмяDto dto) { ... }
    public List<ИмяDto> getAll() { ... }
    public ИмяDto getById(Long id) { ... }
    public ИмяDto update(Long id, ИмяDto dto) { ... }
    public void delete(Long id) { ... }
}
```

### Шаблон getById с исключением
```java
public ИмяСущность getById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Сущность с id " + id + " не найдена"));
}
```

### Шаблон toDto
```java
private ИмяDto toDto(ИмяСущность entity) {
    return ИмяDto.builder()
        .поле1(entity.getПоле1())
        .поле2(entity.getПоле2())
        .build();
}
```

### Шаблон toEntity
```java
private ИмяСущность toEntity(ИмяDto dto) {
    return ИмяСущность.builder()
        .поле1(dto.getПоле1())
        .поле2(dto.getПоле2())
        .build();
}
```

---

## ЭТАП 6: DTO (5 минут)

### Пакет `controller`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ИмяDto {
    private Long id;
    private Тип поле1;
    private Тип поле2;
    // БЕЗ обратных ссылок!
}
```

---

## ЭТАП 7: КОНТРОЛЛЕРЫ (10 минут)

### Пакет `controller`

```java
@RestController
@RequestMapping("/api/имя")
@RequiredArgsConstructor
public class ИмяController {

    private final ИмяService service;

    @GetMapping
    public List<ИмяDto> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public ИмяDto getById(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    public ИмяDto create(@Valid @RequestBody ИмяDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public ИмяDto update(@PathVariable Long id, @Valid @RequestBody ИмяDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
```

### Аннотации
- `@PathVariable` — берёт значение из URL
- `@RequestBody` — берёт JSON из тела запроса
- `@RequestParam` — берёт параметр из ?key=value
- `@Valid` — включает валидацию полей в DTO

---

## ЭТАП 8: ИСКЛЮЧЕНИЯ (5 минут)

### Пакет `exception`

```java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) { super(message); }
}

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) { super(message); }
}

public class ConflictException extends RuntimeException {
    public ConflictException(String message) { super(message); }
}
```

### GlobalExceptionHandler
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException e) {
        return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(BadRequestException e) {
        return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Map<String, String>> handleConflict(ConflictException e) {
        return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.status(400).body(Map.of("error", "Ошибка валидации", "details", errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleOther() {
        return ResponseEntity.status(500).body(Map.of("error", "Внутренняя ошибка сервера"));
    }
}
```

---

## ЭТАП 9: БЕЗОПАСНОСТЬ (15 минут)

### Пакет `security`

### JwtUtil.java
```java
@Component
public class JwtUtil {
    private static final String SECRET = "очень_длинный_секретный_ключ_минимум_32_символа!";
    private static final long EXPIRATION = 86400000; // 24 часа

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
            Base64.getEncoder().encodeToString(SECRET.getBytes()));
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String username, String role) {
        return Jwts.builder()
            .subject(username)
            .claim("role", role)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
            .signWith(getSigningKey())
            .compact();
    }

    public String getUsernameFromToken(String token) {
        return getClaims(token).getSubject();
    }

    public boolean validateToken(String token) {
        try { getClaims(token); return true; }
        catch (JwtException e) { return false; }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
```

### JwtFilter.java
```java
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain filterChain) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.getUsernameFromToken(token);
                UserEntity user = userService.getByUsername(username);
                List<SimpleGrantedAuthority> authorities =
                    List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
                SecurityContextHolder.getContext().setAuthentication(
                    new UsernamePasswordAuthenticationToken(username, null, authorities));
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

### SecurityConfig.java
```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtFilter jwtFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(List.of("http://localhost:5173"));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                config.setAllowCredentials(true);
                return config;
            }))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
```

### SecurityUtils.java
```java
@Component
public class SecurityUtils {
    public String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
```

---

## ЭТАП 10: ВАЛИДАЦИЯ (3 минуты)

### Аннотации в DTO
```java
@NotBlank(message = "Поле обязательно")
@Size(min = 3, max = 50, message = "От 3 до 50 символов")
@Email(message = "Некорректный email")
@Min(value = 0, message = "Не меньше 0")
@NotNull(message = "Не может быть null")
```

### В контроллере
```java
public Dto create(@Valid @RequestBody Dto dto) { ... }
```

---

## ЭТАП 11: НАЧАЛЬНЫЕ ДАННЫЕ (5 минут)

### DataInitializer.java
```java
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    // Внедрить все нужные репозитории и BCryptPasswordEncoder

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // Создать админа
        // Создать пользователя
        // Создать тестовые данные
        // Вывести токены в консоль
    }
}
```

---

## ЭТАП 12: SWAGGER (2 минуты)

### OpenApiConfig.java (пакет `config`)
```java
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info().title("API").version("1.0"))
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
            .components(new Components()
                .addSecuritySchemes("bearerAuth", new SecurityScheme()
                    .name("bearerAuth")
                    .type(Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")));
    }
}
```

Доступ: `http://localhost:8080/swagger-ui/index.html`

---

## ЭТАП 13: ФРОНТЕНД (30 минут)

### Создание проекта
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install tailwind @tailwindcss/vite
```

### vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [react(), tailwindcss()],
})
```

### src/index.css
```css
@import "tailwindcss";
```

### Структура
```
src/
├── api.js
├── App.jsx
├── index.css
└── pages/
    ├── LoginPage.jsx
    ├── RegisterPage.jsx
    ├── CatalogPage.jsx
    ├── MyOrdersPage.jsx
    ├── OrderDetailPage.jsx
    ├── AdminProductsPage.jsx
    ├── AdminOrdersPage.jsx
    └── AdminUsersPage.jsx
```

### api.js — основа
```js
const API = 'http://localhost:8080/api';
export const setToken = (t) => localStorage.setItem('token', t);
export const getToken = () => localStorage.getItem('token');

async function authFetch(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };
    const res = await fetch(`${API}${url}`, { ...options, headers });
    const text = await res.text();
    if (!text) return null;
    const data = JSON.parse(text);
    if (!res.ok) {
        if (data.details) {
            const messages = Object.entries(data.details).map(([f, m]) => `${f}: ${m}`).join('\n');
            throw new Error(messages);
        }
        throw new Error(data.error || 'Ошибка запроса');
    }
    return data;
}
```

### App.jsx — навигация и роли
```jsx
const [page, setPage] = useState('catalog');
const [role, setRole] = useState(null);

// Извлечение роли из токена
useEffect(() => {
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(payload.role || 'USER');
    }
}, [token]);

const isAdmin = role === 'ADMIN';
// Админские вкладки показывать только если isAdmin
```

### Tailwind — минимальный набор классов
```
flex flex-col md:flex-row     — адаптивная строка/колонка
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 — адаптивная сетка
w-full max-w-md mx-auto       — центрированный блок
p-4, m-4, gap-4               — отступы
bg-white, shadow, rounded     — карточка
text-red-500, bg-blue-500     — цвета
hidden sm:block               — скрыть/показать на экранах
```

---

## ЭТАП 14: ЗАПУСК И ПРОВЕРКА

### Бэкенд
```bash
cd папка_проекта
.\mvnw.cmd spring-boot:run
```

### Фронтенд
```bash
cd frontend
npm run dev
```

### Проверка
1. `http://localhost:8080/swagger-ui/index.html` — API
2. `http://localhost:5173` — фронтенд
3. Войти как `admin` / `admin`
4. Проверить админские вкладки
5. Войти как `user` / `user`
6. Проверить каталог и корзину

---

## БЫСТРЫЕ КОМАНДЫ

```bash
# Аудит
java -version && javac -version && psql -U postgres && node -v && npm -v

# БД
psql -U postgres -c "CREATE DATABASE exam_db;"

# Скачать проект (если есть curl)
curl -G https://start.spring.io/starter.zip \
  -d dependencies=web,data-jpa,postgresql,lombok,validation,security \
  -d javaVersion=21 -d bootVersion=3.3.6 -d type=maven-project \
  -d groupId=com.example -d artifactId=demo -o demo.zip

# Распаковать
tar -xf demo.zip  # или powershell Expand-Archive

# Запуск бэка
.\mvnw.cmd spring-boot:run

# Фронтенд
npm create vite@latest frontend -- --template react
cd frontend && npm install && npm install tailwind @tailwindcss/vite
npm run dev
```

---

## ЧТО ГОВОРИТЬ ПРЕПОДАВАТЕЛЮ

1. **Архитектура:** трёхслойная (Controller → Service → Repository)
2. **Безопасность:** Spring Security + JWT, роли ADMIN/USER
3. **База данных:** PostgreSQL, Hibernate, ddl-auto=create
4. **API:** REST, все ответы в JSON
5. **DTO:** отделение Entity от данных клиента
6. **Валидация:** на сервере через Bean Validation
7. **Обработка ошибок:** глобальный обработчик, понятные сообщения
8. **Документация:** Swagger/OpenAPI
9. **Фронтенд:** React + Tailwind, адаптивная вёрстка, SPA без роутера
10. **Начальные данные:** DataInitializer, админ создаётся автоматически

---

Сохрани этот файл как `ШПАРГАЛКА.md` и закинь на флешку или в телефон перед экзаменом. Удачи!