import { IsOptional, IsString, IsIn } from 'class-validator';


const validStatuses = ['pending', 'assigned', 'completed', 'cancelled'];

export class FindAllOrdersDto {
  @IsOptional()
  @IsString()
  @IsIn(validStatuses)
  status?: string;
}