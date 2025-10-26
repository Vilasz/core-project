// src/app/api/auth/register/route.ts
export const runtime = 'nodejs'; // Prisma não funciona em edge

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

type Role = 'STUDENT' | 'TEACHER';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Desestruturação com defaults e normalizações
    const name: string | undefined = body?.name?.trim();
    const emailRaw: string | undefined = body?.email?.trim();
    const password: string | undefined = body?.password;
    const role: Role = (body?.role ?? 'STUDENT') as Role;
    const phone: string | undefined = body?.phone?.trim();
    const specialtiesInput: string[] | undefined = Array.isArray(body?.specialties) ? body.specialties : undefined;
    const bio: string = typeof body?.bio === 'string' ? body.bio.trim() : '';
    const hourlyRateRaw = body?.hourlyRate;

    // Validações básicas
    if (!name || !emailRaw || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const email = emailRaw.toLowerCase();

    if (role === 'TEACHER') {
      if (!specialtiesInput || specialtiesInput.length === 0) {
        return NextResponse.json(
          { error: 'Professores devem selecionar pelo menos uma especialidade' },
          { status: 400 }
        );
      }
      const hourlyRateNum = Number(hourlyRateRaw);
      if (!Number.isFinite(hourlyRateNum) || hourlyRateNum <= 0) {
        return NextResponse.json(
          { error: 'Professores devem definir um valor por hora válido' },
          { status: 400 }
        );
      }
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está em uso' },
        { status: 409 }
      );
    }

    // Hash da senha
    const hashed = await bcrypt.hash(password, 12);

    // Deduplica especialidades (caso venha repetido do front)
    const uniqueSpecialties =
      role === 'TEACHER' && specialtiesInput
        ? Array.from(new Set(specialtiesInput.map((s) => String(s).trim()).filter(Boolean)))
        : [];

    // Cria usuário (e perfil de professor se aplicável) numa transação
    const result = await prisma.$transaction(async (tx) => {
      // IMPORTANTE: use o nome do campo REAL no seu schema, ex.: "hashedPassword"
      const user = await tx.user.create({
        data: {
          name,
          email,
          role,
          phone,
          image: null,
          // <<<<<< ajuste o nome do campo abaixo para o que existe no seu schema.prisma
          hashedPassword: hashed, // se no seu schema estiver "passwordHash", troque para passwordHash
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      if (role === 'TEACHER') {
        // ATENÇÃO ao tipo do campo specialties no schema:
        // - Se for String[] no Postgres: pode enviar string[]
        // - Se for JSON: também pode enviar string[]
        await tx.teacherProfile.create({
          data: {
            userId: user.id,
            specialties: uniqueSpecialties,
            bio,
            hourlyRate: Number(hourlyRateRaw),
            isAvailable: true,
          },
        });
      }

      return user;
    });

    return NextResponse.json(
      {
        message: 'Usuário criado com sucesso',
        user: result, // não retorna hash
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
