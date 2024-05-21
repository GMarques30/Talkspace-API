import { UseCaseError } from 'src/core/errors/use-case-errors';

export class PasswordDoesNotMatchError extends Error implements UseCaseError {
  constructor() {
    super('Password does match');
  }
}
