import { IsString } from 'class-validator';

export class CreateEraseDto {
  @IsString()
  password: string;
}
