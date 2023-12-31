import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength, MaxLength, IsString } from "class-validator";

export default class LoginDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly username: string = "";

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string = "";
}
