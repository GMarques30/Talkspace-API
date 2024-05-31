import { ValueObject } from '../../../../../core/entities/value-object';

export interface NameProps {
  firstName: string;
  lastName: string;
}

export class Name extends ValueObject<NameProps> {
  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  static create(props: NameProps) {
    return new Name(props);
  }
}
