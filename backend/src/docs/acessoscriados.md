# Registro de Acessos Criados

Este documento registra os acessos criados via API para usuários do sistema da pizzaria Massa Nostra. Cada entrada inclui:

- Endpoint utilizado
- Headers obrigatórios
- Payload enviado
- Resposta esperada (sem campo de senha)
- Separador visual para facilitar leitura

---

## João Garçom

**POST** `http://localhost:3000/usuarios`  
**Authorization:** `Bearer <token_admin>`  
**Content-Type:** `application/json`

**Payload:**
```json
{
  "nome": "João Garçom",
  "email": "joao@massa.com",
  "senha": "123456",
  "perfil": "garçom",
  "setor": "atendimento",
  "cargo": "Garçom",
  "ativo": true
}
