# Wellness Marketplace

Um marketplace que conecta alunos e professores de wellness, com foco em funcionalidades que facilitam a vida dos professores.

## Funcionalidades

### Para Alunos
- Buscar professores por especialidade, preço e avaliação
- Visualizar perfis detalhados dos professores
- Agendar aulas online
- Sistema de avaliações
- Dashboard para gerenciar aulas agendadas

### Para Professores
- Dashboard completo com estatísticas
- Gestão de agenda e disponibilidade
- Sistema de pagamentos
- Perfil profissional com especialidades
- Histórico de aulas e ganhos

## Tecnologias

- **Next.js 15.5** com App Router
- **TypeScript** para type safety
- **Prisma** com PostgreSQL
- **NextAuth.js** para autenticação
- **Stripe** para pagamentos
- **Tailwind CSS** para estilização

## Setup do Projeto

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/wellness_marketplace?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 3. Configurar Banco de Dados

```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar schema ao banco
npm run db:push

# Ou criar migration (recomendado para produção)
npm run db:migrate
```

### 4. Executar Projeto

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa linter
- `npm run db:generate` - Gera cliente Prisma
- `npm run db:push` - Aplica schema ao banco
- `npm run db:migrate` - Cria e aplica migration
- `npm run db:studio` - Abre Prisma Studio

## Estrutura do Projeto

```
src/
├── app/                    # App Router (páginas)
│   ├── api/               # API routes
│   ├── auth/              # Páginas de autenticação
│   ├── dashboard/         # Dashboards
│   └── professores/       # Páginas de professores
├── components/            # Componentes React
│   └── ui/               # Componentes base
├── lib/                  # Utilitários e configurações
└── types/               # Definições TypeScript
```

## Próximos Passos

- Integração completa com Stripe
- Sistema de notificações
- Chat entre aluno e professor
- Upload de imagens de perfil
- Testes automatizados
