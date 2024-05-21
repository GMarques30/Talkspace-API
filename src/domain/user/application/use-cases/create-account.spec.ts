import { FakeHasher } from './../../../../../test/cryptography/fake-hasher';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { CreateAccountUseCase } from './create-account';
import { UniqueEntityId } from 'src/core/entities/unique-entity-id';

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
});
