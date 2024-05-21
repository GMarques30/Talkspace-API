import { UseCaseError } from './../../../../../core/errors/use-case-errors';

export class EmailAlreadyUsedByUserError extends Error implements UseCaseError {
  constructor() {
    super('Email already used');
  }
}
