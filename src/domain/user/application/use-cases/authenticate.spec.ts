import { User } from '../../enterprise/entities/user';
import { Name } from '../../enterprise/entities/value-objects/Name';
import { FakeEncrypter } from './../../../../../test/cryptography/fake-encrypter';
import { FakeHasher } from './../../../../../test/cryptography/fake-hasher';
import { InMemoryUsersRepository } from './../../../../../test/repositories/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { WrongCredentialsError } from './errors/wrong-credentials.error';

describe('Authenticate Use Case', () => {
  let fakeEncrypter: FakeEncrypter;
  let fakeHasher: FakeHasher;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let sut: AuthenticateUseCase;

  beforeEach(() => {
    fakeEncrypter = new FakeEncrypter();
    fakeHasher = new FakeHasher();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('shoudl be able authenticate a user', async () => {
    const user = User.create({
      name: Name.create({
        firstName: 'John',
        lastName: 'Doe',
      }),
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        user,
      }),
    );
  });

  it('should not be able authenticate a user that doesnt exist', async () => {
    const result = await sut.execute({
      email: 'usernotexists@example.com',
      password: 'usernotexits',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
