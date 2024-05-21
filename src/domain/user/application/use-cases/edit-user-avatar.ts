import { left, right } from './../../../../core/either';
import { Either } from 'src/core/either';
import { UsersRepository } from '../repositories/users-repository';
import { Uploader } from '../storage/uploader';
import { User } from '../../enterprise/entities/user';
import { InvalidAvatarType } from './errors/invalid-avatar-type';
import { UserNotFoundError } from './errors/user-not-found-error';

interface EditUserAvatarInput {
  userId: string;
  fileName: string;
  fileType: string;
  body: Buffer;
}

type EditUserAvatarOutput = Either<
  UserNotFoundError | InvalidAvatarType,
  {
    user: User;
  }
>;

export class EditUserAvatarUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    userId,
    fileName,
    fileType,
    body,
  }: EditUserAvatarInput): Promise<EditUserAvatarOutput> {
    const user = await this.usersRepository.findUserById(userId);

    if (!user) return left(new UserNotFoundError());

    if (!/^image\/(jpeg|png)$/.test(fileType)) {
      return left(new InvalidAvatarType(fileType));
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body });

    user.avatarUrl = url;

    await this.usersRepository.save(user);

    return right({
      user,
    });
  }
}
