import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { Optional } from '../../../../core/types/optional';
import { Entity } from '../../../../core/entities/entity';
import { isAfter } from 'date-fns';

interface UserTokenProps {
  userId: UniqueEntityId;
  createdAt: Date;
  expiresIn: Date;
}

export class Token extends Entity<UserTokenProps> {
  get userId() {
    return this.props.userId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get expiresIn() {
    return this.props.expiresIn;
  }

  validateToken(date: Date) {
    if (isAfter(date, this.expiresIn)) {
      return false;
    }

    return true;
  }

  static create(
    props: Optional<UserTokenProps, 'createdAt' | 'expiresIn'>,
    id?: UniqueEntityId,
  ) {
    const createdAt = props.createdAt ?? new Date();
    const expiresIn =
      props.expiresIn ?? new Date(createdAt.getTime() + 1000 * 60 * 60);

    return new Token(
      {
        ...props,
        createdAt,
        expiresIn,
      },
      id,
    );
  }
}
