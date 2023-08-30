import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { EmployeeRole } from "./models/models";

export default class UpdateEmployeeDto {
  @ApiProperty({ type: String })
  @IsString()
  readonly role: EmployeeRole;

  @ApiProperty({ type: String })
  @IsString()
  readonly locationId: string = "";

  @ApiProperty({ type: String })
  @IsString()
  readonly name: string = "";
}
