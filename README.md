# Petstore API com Playwright

Projeto de automacao de testes da [Swagger Petstore](https://petstore.swagger.io/) usando Playwright Test e TypeScript.

## Objetivos

- Demonstrar testes de API organizados e independentes.
- Cobrir cenarios positivos, negativos e um fluxo CRUD completo.
- Validar o contrato das respostas e filtros da API.
- Gerar dados unicos para permitir execucao paralela.
- Executar validacao de tipos e testes no GitHub Actions.

## Tecnologias

- Node.js 22+
- TypeScript
- Playwright Test
- GitHub Actions

## Estrutura

```text
src/
  clients/       # Comunicacao com os endpoints
  factories/     # Geracao de massa de teste
  types/         # Contratos TypeScript
tests/           # Especificacoes de teste
.github/         # Pipeline de integracao continua
```

## Como executar

```bash
npm install
npm test
```

Outros comandos:

```bash
npm run test:api
npm run typecheck
npm run report
```

Por padrao, os testes usam `https://petstore.swagger.io/v2`. Para testar outra instancia:

```bash
API_BASE_URL=http://localhost:8080/v2 npm test
```

No PowerShell:

```powershell
$env:API_BASE_URL='http://localhost:8080/v2'; npm test
```

## Observacao sobre a API publica

A Petstore publica e compartilhada e pode apresentar indisponibilidade, dados incompletos ou interferencia externa. Os testes usam IDs unicos e validam campos opcionais da listagem somente quando presentes. Em uma evolucao do projeto, uma instancia local em Docker pode tornar a execucao totalmente controlada.
