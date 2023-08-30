import { ApiProperty } from "@nestjs/swagger";
import { MinLength, MaxLength, IsString } from "class-validator";

export default class CreateEmployeeDto {
  @ApiProperty({ type: String })
  @IsString()
  readonly username: string = "";

  @ApiProperty({ type: String })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string = "";

  @ApiProperty({ type: String })
  @IsString()
  readonly locationId: string = "";

  @ApiProperty({ type: String })
  @IsString()
  readonly name: string = "";
}
