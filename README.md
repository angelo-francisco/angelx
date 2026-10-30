# angelx

Blog estático em Astro. Site: https://angelo-francisco.github.io/angelx/

## Baixar e executar

Instale **Node.js 24** e **Bun 1.3.14**. Depois:

```sh
git clone https://github.com/angelo-francisco/angelx.git
cd angelx
bun install --frozen-lockfile
bun run dev
```

Abra o endereço mostrado no terminal, com o caminho `/angelx/`.

## Escrever

Crie `src/content/blog/meu-texto.md`:

```md
---
title: "Título do texto"
description: "Um resumo curto."
pubDate: "2026-10-30"
tags: ["tecnologia", "aprendizagem"]
---

O texto começa aqui.

## Uma secção

Os títulos de secção aparecem automaticamente no índice do artigo.
```

O nome do arquivo define a URL: `/angelx/meu-texto/`. Use nomes únicos, sem espaços, e datas ISO. Para atualizar um texto, pode acrescentar `updatedDate: '2026-10-31'`. Todos os arquivos nessa pasta são publicados, inclusive textos com datas futuras; mantenha rascunhos fora dela. MDX também é aceito, mas execute apenas conteúdo de autores de confiança.

## Validar e publicar

```sh
bun run validate  # tipos, build e testes dos arquivos gerados
bun audit         # vulnerabilidades conhecidas
bun run preview   # conferir a versão de produção localmente
```

No GitHub, selecione **Settings → Pages → Source → GitHub Actions** e ative **Enforce HTTPS**, quando disponível. Envie as alterações em uma branch e abra um pull request para `main`:

```sh
git switch -c meu-texto
git add src/content/blog/meu-texto.md
git commit -m "Publica novo texto"
git push -u origin meu-texto
```

Após integrar o PR, o workflow **Validate and deploy Astro** valida e publica `dist/`. A branch `work` e os PRs apenas validam; não publicam. Confirme o sucesso na aba **Actions** antes de considerar o site publicado. Para reverter, reverta o commit em `main` e aguarde o novo deploy.

## Configuração e segurança

- Edite o nome e a descrição em `src/consts.ts`; o perfil em `src/pages/about.astro`.
- Se mudar domínio ou caminho, ajuste `site` e `base` em `astro.config.mjs` e as URLs esperadas em `tests/build.test.mjs`.
- Não há backend, login, banco de dados ou segredos necessários. Nunca publique credenciais em Markdown, `public/` ou variáveis `PUBLIC_*`.
- O build aplica CSP com hashes. Scripts e estilos inline, HTML/MDX não confiável e embeds externos exigem revisão; use blocos de código Markdown comuns.
- Atualize as dependências com `bun update`, execute as validações e revise o lockfile. O CI bloqueia a publicação se a auditoria ou os testes falharem.
- O retrato em “Sobre mim” é um monograma provisório. Substitua-o por uma foto sua antes de publicar, se desejar.

A publicação serve somente arquivos estáticos. Cabeçalhos HTTP como HSTS e proteção contra framing dependem do GitHub Pages ou de um proxy/CDN; não são configurados por arquivos `_headers` neste projeto.
