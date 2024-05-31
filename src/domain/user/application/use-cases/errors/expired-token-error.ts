import { UseCaseError } from 'src/core/errors/use-case-errors';

export class ExpiredTokenError extends Error implements UseCaseError {
  constructor() {
    super('Expired Token');
  }
}
