import { registerDecorator, ValidationOptions } from 'class-validator';
import { ForbiddenRoleValidator } from '../validators';
import { Role } from '../enums';

/**
 * 특정 Role 값들을 금지시키는 Validator
 * @param roles 금지할 Role 값 목록
 */
export function ForbiddenRole(
  roles: Role[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: roles,
      validator: ForbiddenRoleValidator,
    });
  };
}
