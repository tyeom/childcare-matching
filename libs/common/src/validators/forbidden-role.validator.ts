import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Role } from '../enums';

@ValidatorConstraint({ async: false })
export class ForbiddenRoleValidator implements ValidatorConstraintInterface {
  validate(value: Role, args: ValidationArguments) {
    const forbiddenRoles = args.constraints as Role[];
    return !forbiddenRoles.includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    const forbiddenRoles = args.constraints as Role[];
    return `${forbiddenRoles.join(', ')} role은 사용할 수 없습니다.`;
  }
}
