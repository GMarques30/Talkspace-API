import { UsersRepository } from '../repositories/users-repository';
import { TokenRepository } from '../repositories/token-repository';
import { Either, left, right } from 'src/core/either';
import { TokenNotFoundError } from './errors/token-not-found-error';
import { UserNotFoundError } from './errors/user-not-found-error';
import { HashGenerator } from '../cryptography/hash-generator';
import { User } from '../../enterprise/entities/user';
import { ExpiredTokenError } from './errors/expired-token-error';

interface ResetPasswordInput {
  userToken: string;
  password: string;
}

type ResetPasswordOutput = Either<
  TokenNotFoundError | ExpiredTokenError | UserNotFoundError,
  {
    user: User;
  }
>;

export class ResetPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private tokenRepository: TokenRepository,
    private hasher: HashGenerator,
  ) {}

  async execute({
    userToken,
    password,
  }: ResetPasswordInput): Promise<ResetPasswordOutput> {
    const token = await this.tokenRepository.findByToken(userToken);

    if (!token) return left(new TokenNotFoundError());

    const dateNow = new Date();

    const validToken = token.validateToken(dateNow);

    if (!validToken) return left(new ExpiredTokenError());

    const user = await this.usersRepository.findUserById(
      token.userId.toString(),
    );

    if (!user) return left(new UserNotFoundError());

    user.password = await this.hasher.hash(password);

    await this.usersRepository.save(user);

    return right({
      user,
    });
  }
}
