import { UserNotFoundError } from './errors/user-not-found-error';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryUsersRepository } from './../../../../../test/repositories/in-memory-users-repository';
import { EditUserProfileUseCase } from './edit-user-profile';
import { User } from '../../enterprise/entities/user';
import { Name } from '../../enterprise/entities/value-objects/Name';
import { EmailAlreadyUsedByUserError } from './errors/email-already-used-by-user-error';
import { InformOldPasswordToSetNewPasswordError } from './errors/inform-old-password-set-new-password-error';
import { PasswordDoesNotMatchError } from './errors/password-does-not-match-error';

describe('Edit User Profile Use Case', () => {
  let fakeHasher: FakeHasher;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let sut: EditUserProfileUseCase;

  beforeEach(() => {
    fakeHasher = new FakeHasher();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new EditUserProfileUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeHasher,
    );
  });

  it('should be able edit user profile', async () => {
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
      userId: user.id.toString(),
      firstName: 'Giovanni',
      lastName: 'Marques',
      email: 'giovanni@example.com',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          name: expect.objectContaining({
            firstName: 'Giovanni',
            lastName: 'Marques',
          }),
          email: 'giovanni@example.com',
        }),
      }),
    );
  });

  it('should not be able edit user profile from non-existent user', async () => {
    const result = await sut.execute({
      userId: 'non-existent-user-id',
      firstName: 'first-name-test',
      lastName: 'last-name-test',
      email: 'email-test@example.com',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should not be able to change the email to an existing one', async () => {
    await inMemoryUsersRepository.create(
      User.create({
        name: Name.create({
          firstName: 'John',
          lastName: 'Doe',
        }),
        email: 'johndoe@example.com',
        password: await fakeHasher.hash('123456'),
      }),
    );

    const user = User.create({
      name: Name.create({
        firstName: 'Test',
        lastName: 'Test',
      }),
      email: 'test@example.com',
      password: await fakeHasher.hash('123456'),
    });

    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(EmailAlreadyUsedByUserError);
  });

  it('should be able edit the password', async () => {
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
      userId: user.id.toString(),
      firstName: 'John',
      lastName: 'Test',
      email: 'johntest@example.com',
      oldPassword: '123456',
      newPassword: '123123',
    });

    const hashedNewPassword = await fakeHasher.hash('123123');

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          password: hashedNewPassword,
        }),
      }),
    );
  });

  it('should not be able edit the password without old password', async () => {
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
      userId: user.id.toString(),
      firstName: 'John',
      lastName: 'Test',
      email: 'johntest@example.com',
      newPassword: '123123',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InformOldPasswordToSetNewPasswordError);
  });

  it('should not be able edit the password with wrong old password', async () => {
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
      userId: user.id.toString(),
      firstName: 'John',
      lastName: 'Test',
      email: 'johntest@example.com',
      oldPassword: '12345',
      newPassword: '123123',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(PasswordDoesNotMatchError);
  });
});
