import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  title: string;

  @IsString()
  cardNumber: string;

  @IsString()
  name: string;

  @IsString()
  cvc: string;

  @IsNotEmpty()
  date: Date;

  @IsString()
  password: string;

  @IsBoolean()
  virtual: boolean;

  @IsString()
  type: string;
}
