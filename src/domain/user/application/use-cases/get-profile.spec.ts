import { UserNotFoundError } from './errors/user-not-found-error';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UsersRepository } from './../repositories/users-repository';
import { GetProfileUseCase } from './get-profile';
import { User } from '../../enterprise/entities/user';
import { Name } from '../../enterprise/entities/value-objects/name';
import { UniqueEntityId } from 'src/core/entities/unique-entity-id';

describe('Get Profile Use Case', () => {
  let usersRepository: UsersRepository;
  let sut: GetProfileUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetProfileUseCase(usersRepository);
  });

  it('should be able to get the users profile', async () => {
    const user = User.create({
      name: Name.create({
        firstName: 'John',
        lastName: 'Doe',
      }),
      email: 'johndoe@example.com',
      password: '123456',
    });

    await usersRepository.create(user);

    const result = await sut.execute({
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: new UniqueEntityId(user.id.toString()),
          email: user.email,
        }),
      }),
    );
  });

  it('should not be able to take the profile of non-existent user', async () => {
    const result = await sut.execute({
      userId: 'non-existent-user-id',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
