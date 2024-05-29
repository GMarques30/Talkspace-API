import { Either, left, right } from 'src/core/either';
import { UsersRepository } from '../repositories/users-repository';
import { UserNotFoundError } from './errors/user-not-found-error';
import { User } from '../../enterprise/entities/user';

interface GetProfileInput {
  userId: string;
}

type GetProfileOutput = Either<
  UserNotFoundError,
  {
    user: User;
  }
>;

export class GetProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: GetProfileInput): Promise<GetProfileOutput> {
    const user = await this.usersRepository.findUserById(userId);

    if (!user) return left(new UserNotFoundError());

    return right({
      user,
    });
  }
}
