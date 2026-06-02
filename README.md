# Gennesi Superadmin

Painel interno para gestão de billing SaaS da plataforma Gennesi (planos, cupons e organizações).

## Desenvolvimento

```bash
npm install
npm run dev
```

Aplicação em [http://localhost:3004](http://localhost:3004).

## Variáveis de ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

## Rotas principais

| Rota | Descrição |
|------|-----------|
| `/auth/v2/login` | Login superadmin |
| `/dashboard` | Visão geral |
| `/planos` | Catálogo de planos |
| `/cupons` | Cupons de desconto |
| `/organizacoes` | Organizações e billing |

## Stack

- Next.js 16 (App Router)
- Tailwind CSS v4 + shadcn/ui
- Autenticação via cookie `token` + API Gennesi
