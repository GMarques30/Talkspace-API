import { UseCaseError } from './../../../../../core/errors/use-case-errors';

export class UserAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`User "${identifier}" already exists`);
  }
}
