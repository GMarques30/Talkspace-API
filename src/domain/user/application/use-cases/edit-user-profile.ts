import { right } from '../../../../core/either';
import { HashComparer } from 'src/domain/user/application/cryptography/hash-comparer';
import { HashGenerator } from 'src/domain/user/application/cryptography/hash-generator';
import { Either, left } from 'src/core/either';
import { UsersRepository } from '../repositories/users-repository';
import { User } from '../../enterprise/entities/user';
import { Name } from '../../enterprise/entities/value-objects/Name';
import { UserNotFoundError } from './errors/user-not-found-error';
import { EmailAlreadyUsedByUserError } from './errors/email-already-used-by-user-error';
import { InformOldPasswordToSetNewPasswordError } from './errors/inform-old-password-set-new-password-error';
import { PasswordDoesNotMatchError } from './errors/password-does-not-match-error';

interface EditUserProfileInput {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  oldPassword?: string;
  newPassword?: string;
}

type EditUserProfileOutput = Either<
  | UserNotFoundError
  | EmailAlreadyUsedByUserError
  | InformOldPasswordToSetNewPasswordError
  | PasswordDoesNotMatchError,
  {
    user: User;
  }
>;

export class EditUserProfileUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private hashComparer: HashComparer,
  ) {}

  async execute({
    userId,
    firstName,
    lastName,
    email,
    oldPassword,
    newPassword,
  }: EditUserProfileInput): Promise<EditUserProfileOutput> {
    const userAlreadyExist = await this.usersRepository.findUserById(userId);

    if (!userAlreadyExist) return left(new UserNotFoundError());

    const emailAlreadyUsedByUser =
      await this.usersRepository.findUserByEmail(email);

    if (emailAlreadyUsedByUser) return left(new EmailAlreadyUsedByUserError());

    userAlreadyExist.name = Name.create({
      firstName,
      lastName,
    });

    userAlreadyExist.email = email;

    if (newPassword && !oldPassword)
      return left(new InformOldPasswordToSetNewPasswordError());

    if (newPassword && oldPassword) {
      const isValidPassword = await this.hashComparer.compare(
        oldPassword,
        userAlreadyExist.password,
      );

      if (!isValidPassword) return left(new PasswordDoesNotMatchError());

      userAlreadyExist.password = await this.hashGenerator.hash(newPassword);
    }

    await this.usersRepository.save(userAlreadyExist);

    return right({
      user: userAlreadyExist,
    });
  }
}
