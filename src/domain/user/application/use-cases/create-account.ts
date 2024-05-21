import { Either, left, right } from './../../../../core/either';
import { UsersRepository } from '../repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { HashGenerator } from '../cryptography/hash-generator';
import { User } from '../../enterprise/entities/user';
import { Name } from '../../enterprise/entities/value-objects/Name';

interface CreateAccountInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

type CreateAccountOutput = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;

export class CreateAccountUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    firstName,
    lastName,
    email,
    password,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    const userWithSameEmail = await this.usersRepository.findUserByEmail(email);

    if (userWithSameEmail) return left(new UserAlreadyExistsError(email));

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name: Name.create({
        firstName,
        lastName,
      }),
      email,
      password: hashedPassword,
    });

    await this.usersRepository.create(user);

    return right({
      user,
    });
  }
}
