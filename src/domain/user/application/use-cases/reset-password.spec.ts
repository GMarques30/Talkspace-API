import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { ResetPasswordUseCase } from './reset-password';
import { InMemoryTokenRepository } from 'test/repositories/in-memory-token-repository';
import { Token } from '../../enterprise/entities/token';
import { User } from '../../enterprise/entities/user';
import { Name } from '../../enterprise/entities/value-objects/name';
import { UniqueEntityId } from 'src/core/entities/unique-entity-id';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { TokenNotFoundError } from './errors/token-not-found-error';
import { ExpiredTokenError } from './errors/expired-token-error';
import { UserNotFoundError } from './errors/user-not-found-error';

describe('Reset Password Use Case', () => {
  let tokenRepository: InMemoryTokenRepository;
  let usersRepository: InMemoryUsersRepository;
  let fakeHasher: FakeHasher;
  let sut: ResetPasswordUseCase;

  beforeEach(() => {
    tokenRepository = new InMemoryTokenRepository();
    usersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new ResetPasswordUseCase(
      usersRepository,
      tokenRepository,
      fakeHasher,
    );
  });

  it('should be able to reset a users password', async () => {
    const user = User.create({
      name: Name.create({
        firstName: 'John',
        lastName: 'Doe',
      }),
      email: 'johndoe@example.com',
      password: '123456',
    });

    await usersRepository.create(user);

    const userToken = Token.create({
      userId: new UniqueEntityId(user.id.toString()),
    });

    await tokenRepository.create(userToken);

    const result = await sut.execute({
      userToken: userToken.id.toString(),
      password: '123123',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          password: '123123-hashed',
        }),
      }),
    );
  });

  it('should not be able to reset users password if the token does not exist', async () => {
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
      userToken: 'token-non-existent',
      password: '123123',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(TokenNotFoundError);
  });

  it('should not be able to reset users password after the token has expired', async () => {
    const user = User.create({
      name: Name.create({
        firstName: 'John',
        lastName: 'Doe',
      }),
      email: 'johndoe@example.com',
      password: '123456',
    });

    await usersRepository.create(user);

    const pastDate = new Date(Date.now() - 3000 * 60 * 60);

    const userToken = Token.create({
      userId: new UniqueEntityId(user.id.toString()),
      expiresIn: pastDate,
    });

    await tokenRepository.create(userToken);

    const result = await sut.execute({
      userToken: userToken.id.toString(),
      password: '123123',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ExpiredTokenError);
  });

  it('should not be able to reset the password of a non-existent user', async () => {
    const userToken = Token.create({
      userId: new UniqueEntityId('non-existent-user-id'),
    });

    await tokenRepository.create(userToken);

    const result = await sut.execute({
      userToken: userToken.id.toString(),
      password: '123123',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
