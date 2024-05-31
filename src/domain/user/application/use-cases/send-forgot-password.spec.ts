import { SendForgotPasswordUseCase } from './send-forgot-password';
import { InMemoryTokenRepository } from 'test/repositories/in-memory-token-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FakeMailer } from 'test/mail/fake-mailer';
import { User } from '../../enterprise/entities/user';
import { Name } from '../../enterprise/entities/value-objects/name';
import { UniqueEntityId } from 'src/core/entities/unique-entity-id';

describe('Send Forgot Password Use Case', () => {
  let tokenRepository: InMemoryTokenRepository;
  let usersRepository: InMemoryUsersRepository;
  let fakeMailer: FakeMailer;
  let sut: SendForgotPasswordUseCase;

  beforeEach(() => {
    tokenRepository = new InMemoryTokenRepository();
    usersRepository = new InMemoryUsersRepository();
    fakeMailer = new FakeMailer();
    sut = new SendForgotPasswordUseCase(
      usersRepository,
      tokenRepository,
      fakeMailer,
    );
  });

  it('should be able to see if the sendMail method has been called', async () => {
    const sendMailSpy = vitest.spyOn(fakeMailer, 'sendMail');

    const user = User.create({
      name: Name.create({
        firstName: 'John',
        lastName: 'Doe',
      }),
      email: 'johndoe@example.com',
      password: '123456',
    });

    await usersRepository.create(user);

    await sut.execute({ email: user.email });

    expect(sendMailSpy).toHaveBeenCalled();
    expect(tokenRepository.tokens).toHaveLength(1);
  });

  it('should be able to check whether the password reset token is created', async () => {
    const user = User.create({
      name: Name.create({
        firstName: 'John',
        lastName: 'Doe',
      }),
      email: 'johndoe@example.com',
      password: '123456',
    });

    await usersRepository.create(user);

    await sut.execute({
      email: user.email,
    });

    expect(tokenRepository.tokens).toHaveLength(1);
    expect(tokenRepository.tokens[0]).toEqual(
      expect.objectContaining({
        userId: new UniqueEntityId(user.id.toString()),
        createdAt: expect.any(Date),
        expiresIn: expect.any(Date),
      }),
    );
  });
});
