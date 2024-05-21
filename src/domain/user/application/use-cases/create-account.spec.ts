import { FakeHasher } from './../../../../../test/cryptography/fake-hasher';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { CreateAccountUseCase } from './create-account';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('Create Account Use Case', () => {
  let fakeHasher: FakeHasher;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let sut: CreateAccountUseCase;

  beforeEach(() => {
    fakeHasher = new FakeHasher();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new CreateAccountUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it('should be able create an account', async () => {
    const result = await sut.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.users[0],
    });
  });

  it('should be able encrypt users password', async () => {
    const result = await sut.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryUsersRepository.users[0].password).toEqual(hashedPassword);
  });

  it('should not be able create a account that exists', async () => {
    await sut.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const result = await sut.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
  });
});
