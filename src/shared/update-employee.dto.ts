import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export default class UpdateEmployeeDto {
  @ApiProperty({ type: String })
  @IsString()
  readonly name: string = "";
}
