import { IsString, IsUrl } from 'class-validator';

export class CreateCredentialDto {
  @IsString()
  title: string;

  @IsString()
  @IsUrl()
  url: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
}
