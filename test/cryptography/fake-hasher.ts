import { HashComparer } from './../../src/domain/user/application/cryptography/hash-comparer';
import { HashGenerator } from './../../src/domain/user/application/cryptography/hash-generator';

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed');
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash;
  }
}
