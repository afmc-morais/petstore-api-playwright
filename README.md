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
- Docker Compose

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

Pre-requisitos: Node.js 22+ e Docker Desktop (Windows/macOS) ou Docker Engine
com o plugin Compose (Linux).

```bash
npm install
npm run test:local
```

O comando `test:local` sobe a Petstore em Docker, aguarda a API ficar
saudavel, executa os testes e remove o container ao final, inclusive quando
algum teste falha.

Outros comandos:

```bash
npm run test:api
npm run typecheck
npm run report
npm run api:up
npm run api:down
```

`test:api` usa a URL configurada em `API_BASE_URL` ou, quando a variavel nao
esta definida, a Petstore publica. Para testar outra instancia:

```bash
API_BASE_URL=http://localhost:8080/api/v3 npm run test:api
```

No PowerShell:

```powershell
$env:API_BASE_URL='http://localhost:8080/api/v3'; npm run test:api
```

## Observacao sobre a API publica

A Petstore publica e compartilhada e pode apresentar indisponibilidade, dados incompletos ou interferencia externa. Os testes usam IDs unicos e validam campos opcionais da listagem somente quando presentes.

Por esse motivo, a execucao principal e o pipeline usam a imagem oficial
`swaggerapi/petstore3:1.0.27` localmente. A API publica permanece disponivel
para testes manuais por meio de `API_BASE_URL`.

## Solucao de problemas

Se o comando informar que nao foi possivel conectar a
`dockerDesktopLinuxEngine`, abra o Docker Desktop e aguarde o status
`Engine running` antes de executar `npm run test:local` novamente. No Windows,
confirme tambem que o backend WSL 2 esta habilitado nas configuracoes do Docker
Desktop.
