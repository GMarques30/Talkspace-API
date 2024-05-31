import { Optional } from './../../../../core/types/optional';
import { UniqueEntityId } from './../../../../core/entities/unique-entity-id';
import { Entity } from './../../../../core/entities/entity';
import { Name } from './value-objects/name';

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

  set name(name: Name) {
    this.props.name = name;
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }

  get avatarUrl() {
    return this.props.avatarUrl;
  }

  set avatarUrl(avatarUrl: string) {
    this.props.avatarUrl = avatarUrl;
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
