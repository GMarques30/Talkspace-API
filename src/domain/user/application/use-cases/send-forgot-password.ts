import { Mailer } from './../mailer/mailer';
import { left } from './../../../../core/either';
import { UsersRepository } from '../repositories/users-repository';
import { UserNotFoundError } from './errors/user-not-found-error';
import { TokenRepository } from '../repositories/token-repository';
import { Token } from '../../enterprise/entities/token';
import path from 'path';
import { UniqueEntityId } from 'src/core/entities/unique-entity-id';

interface SendForgotPasswordInput {
  email: string;
}

export class SendForgotPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private tokenRepository: TokenRepository,
    private mailer: Mailer,
  ) {}

  async execute({ email }: SendForgotPasswordInput) {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) return left(new UserNotFoundError());

    const userToken = Token.create({
      userId: new UniqueEntityId(user.id.toString()),
    });

    await this.tokenRepository.create(userToken);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await this.mailer.sendMail({
      to: {
        name: user.name.toString(),
        email,
      },
      from: {
        name: 'Talkspace',
        email: 'reset-password@talkspace.com',
      },
      subject: '[Talkspace] Recuperação de senha',
      template: {
        file: forgotPasswordTemplate,
        link: `http://localhost:8080/reset-password?token=${userToken.id.toString()}`, // Alterar para variaveis ambiente
      },
    });
  }
}
