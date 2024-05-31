import { Token } from '../../src/domain/user/enterprise/entities/token';
import { UsersTokenRepository } from 'src/domain/user/application/repositories/users-token-repository';

export class InMemoryTokenRepository implements UsersTokenRepository {
  public tokens: Token[] = [];

  async create(userToken: Token): Promise<void> {
    this.tokens.push(userToken);
  }

  async findByToken(userToken: string): Promise<Token | null> {
    const token = this.tokens.find(
      (token) => token.id.toString() === userToken,
    );

    if (!token) return null;

    return token;
  }
}
