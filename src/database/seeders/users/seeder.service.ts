import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../models/users/entities/user.entity';
import { UserFactory } from '../../factories/users/factory';

@Injectable()
export class UsersSeederService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async seed(): Promise<void> {
    // Crear usuario admin
    const adminExists = await this.usersRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!adminExists) {
      const admin = this.usersRepository.create(
        UserFactory.generate({
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          roles: ['admin', 'user'],
        }),
      );
      await this.usersRepository.save(admin);
      console.log('Admin user created');
    }

    // Crear usuarios de prueba
    const usersCount = await this.usersRepository.count();
    if (usersCount < 5) {
      const usersToCreate = 5 - usersCount;
      const users = UserFactory.generateMany(usersToCreate);

      for (const userData of users) {
        const user = this.usersRepository.create(userData);
        await this.usersRepository.save(user);
      }

      console.log(`${usersToCreate} test users created`);
    }
  }
}
