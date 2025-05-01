import { prisma } from '../prisma/prisma';
import { Role } from '@prisma/client';
import inquirer from 'inquirer';
import argon2 from 'argon2';
import type { Answers } from 'inquirer';

// Accept a function with the same signature as inquirer.prompt, not the full type
export async function setupSuperAdminLogic(
  prompt: (questions: any) => Promise<Answers> = inquirer.prompt
) {
    const existing = await prisma.user.findFirst({
        where: { role: Role.SUPER_ADMIN },
    });

    if (existing) {
        throw new Error('A SUPER_ADMIN already exists.');
    }

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'email',
            message: 'Super Admin email:',
            validate: (v) => /\S+@\S+\.\S+/.test(v) || 'Must be a valid email',
        },
        {
            type: 'input',
            name: 'name',
            message: 'Name:',
        },
        {
            type: 'password',
            name: 'password',
            message: 'Password:',
            mask: '*',
        },
    ]);

    const hash = await argon2.hash(answers.password);

    const user = await prisma.user.create({
        data: {
            email: answers.email,
            name: answers.name,
            password: hash,
            role: Role.SUPER_ADMIN,
        },
    });

    return user;
}