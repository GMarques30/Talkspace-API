import { UseCaseError } from './../../../../../core/errors/use-case-errors';

export class InformOldPasswordToSetNewPasswordError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('You need to inform to old password to set a new password');
  }
}
