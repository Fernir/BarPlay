import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
     console.log('Запуск seed...');

     // Создание администратора
     const adminEmail = 'admin@example.com';
     const existingAdmin = await prisma.user.findUnique({
          where: { email: adminEmail },
     });

     if (!existingAdmin) {
          const hashedPassword = await bcrypt.hash('admin123', 10);

          const admin = await prisma.user.create({
               data: {
                    email: adminEmail,
                    username: 'admin',
                    password: hashedPassword,
                    role: 'ADMIN',
               },
          });

          console.log('Администратор создан:', admin.email);
          console.log('Логин: admin@example.com');
          console.log('Пароль: admin123');
     } else {
          console.log('Администратор уже существует');
     }

     // Создание тестового модератора (опционально)
     const moderatorEmail = 'moderator@example.com';
     const existingModerator = await prisma.user.findUnique({
          where: { email: moderatorEmail },
     });

     if (!existingModerator) {
          const hashedPassword = await bcrypt.hash('moder123', 10);

          await prisma.user.create({
               data: {
                    email: moderatorEmail,
                    username: 'moderator',
                    password: hashedPassword,
                    role: 'MODERATOR',
               },
          });

          console.log('Модератор создан: moderator@example.com');
     }

     console.log('Seed завершен!');
}

main()
     .catch((e) => {
          console.error('❌ Ошибка seed:', e);
          // @ts-ignore
          process.exit(1);
     })
     .finally(async () => {
          await prisma.$disconnect();
     });
