import { User } from './domain/user/enterprise/entities/user';
import { Name } from './domain/user/enterprise/entities/value-objects/Name';

function main() {
  const user = User.create({
    name: Name.create({
      firstName: 'Giovanni',
      lastName: 'Marques',
    }),
    email: 'giovanni@example.com',
    password: '123456',
  });

  console.log(user.name);
}
main();
