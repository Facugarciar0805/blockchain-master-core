import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';

export class UpdateRegisterDto extends PartialType(RegisterDto) {}
