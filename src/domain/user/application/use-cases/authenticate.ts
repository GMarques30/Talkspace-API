import { Encrypter } from 'src/domain/user/application/cryptography/encrypter';
import { HashComparer } from 'src/domain/user/application/cryptography/hash-comparer';
import { UsersRepository } from '../repositories/users-repository';
import { left, right } from 'src/core/either';
import { WrongCredentialsError } from './errors/wrong-credentials.error';
import { User } from '../../enterprise/entities/user';
import { Name } from '../../enterprise/entities/value-objects/Name';
import { UniqueEntityId } from 'src/core/entities/unique-entity-id';

interface AuthenticateInput {
  email: string;
  password: string;
}

export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({ email, password }: AuthenticateInput) {
    const userAlreadyExists = await this.usersRepository.findUserByEmail(email);

    if (!userAlreadyExists) return left(new WrongCredentialsError());

    const isValidPassword = await this.hashComparer.compare(
      password,
      userAlreadyExists.password,
    );

    if (!isValidPassword) return left(new WrongCredentialsError());

    const user = User.create(
      {
        name: Name.create({
          firstName: userAlreadyExists.name.firstName,
          lastName: userAlreadyExists.name.lastName,
        }),
        email: userAlreadyExists.email,
        password: userAlreadyExists.password,
        avatarUrl: userAlreadyExists.avatarUrl,
        createdAt: new Date(userAlreadyExists.createdAt),
      },
      new UniqueEntityId(userAlreadyExists.id.toString()),
    );

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    });

    return right({
      accessToken,
      user,
    });
  }
}
