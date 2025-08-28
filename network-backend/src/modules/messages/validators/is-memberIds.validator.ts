import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsMemberIdsValid', async: false })
export class IsMemberIdsValid implements ValidatorConstraintInterface {
    validate(memberIds: string[], args: ValidationArguments) {
        const dto = args.object as any;

        if (dto.isGroup) {
            return Array.isArray(memberIds) && memberIds.length >= 2;
        } else {
            return Array.isArray(memberIds) && memberIds.length === 1;
        }
    }

    defaultMessage(args: ValidationArguments) {
        const dto = args.object as any;
        if (dto.isGroup) {
            return 'Group conversation must have at least 2 members';
        }
        return 'Direct conversation must have exactly 1 member';
    }
}
