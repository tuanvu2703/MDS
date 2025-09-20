import { PartialType } from '@nestjs/mapped-types';
import { CreateBackgroundDto } from './createbackground.dto';

export class UpdateBackgroundDto extends PartialType(CreateBackgroundDto) { }