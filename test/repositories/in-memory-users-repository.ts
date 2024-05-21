import { UsersRepository } from 'src/domain/user/application/repositories/users-repository';
import { User } from 'src/domain/user/enterprise/entities/user';

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = [];

  async findUserByEmail(email: string): Promise<User | null> {
    const userAlreadyExists = this.users.find((user) => user.email === email);

    if (!userAlreadyExists) return null;

    return userAlreadyExists;
  }

  async findUserById(userId: string): Promise<User | null> {
    const userAlreadyExists = this.users.find(
      (user) => user.id.toString() === userId,
    );

    if (!userAlreadyExists) return null;

    return userAlreadyExists;
  }

  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  async save(user: User): Promise<void> {
    const userIndex = this.users.findIndex(
      (user) => user.id.toString() === user.id.toString(),
    );

    this.users[userIndex] = user;
  }
}
