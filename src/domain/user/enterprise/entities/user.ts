import { Optional } from './../../../../core/types/optional';
import { UniqueEntityId } from './../../../../core/entities/unique-entity-id';
import { Entity } from './../../../../core/entities/entity';
import { Name } from './value-objects/Name';

export interface UserProps {
  name: Name;
  email: string;
  password: string;
  avatarUrl: string;
  createdAt: Date;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.email;
  }

  get avatarUrl() {
    return this.props.avatarUrl;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'avatarUrl'>,
    id?: UniqueEntityId,
  ) {
    return new User(
      {
        ...props,
        avatarUrl: props.avatarUrl ?? '',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
