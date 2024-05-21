import { UsersRepository } from 'src/domain/user/application/repositories/users-repository';
import { User } from 'src/domain/user/enterprise/entities/user';

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = [];

  async findUserByEmail(email: string): Promise<User | null> {
    const userAlreadyExists = this.users.find((user) => user.email === email);

    if (!userAlreadyExists) return null;

    return userAlreadyExists;
  }

  async create(user: User): Promise<void> {
    this.users.push(user);
  }
}
