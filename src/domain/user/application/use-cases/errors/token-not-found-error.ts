import { UseCaseError } from '../../../../../core/errors/use-case-errors';

export class TokenNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Token not found');
  }
}
