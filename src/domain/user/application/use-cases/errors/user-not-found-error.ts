import { UseCaseError } from './../../../../../core/errors/use-case-errors';

export class UserNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('User not found');
  }
}
