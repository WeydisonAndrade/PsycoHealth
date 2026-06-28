/** Variáveis mínimas para testes de sessão JWT e integração */
process.env.JWT_SECRET ??= "test-jwt-secret-with-at-least-32-characters";
process.env.NODE_ENV ??= "test";
