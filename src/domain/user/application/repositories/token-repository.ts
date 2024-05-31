import { Token } from '../../enterprise/entities/token';

export interface TokenRepository {
  create(userToken: Token): Promise<void>;
  findByToken(userToken: string): Promise<Token | null>;
}
