import { UniqueEntityId } from './core/entities/unique-entity-id';
import { UserToken } from './domain/user/enterprise/entities/token';

function main() {
  const userToken = UserToken.create({
    userId: new UniqueEntityId().toString(),
  });

  console.log(userToken);
}
main();
