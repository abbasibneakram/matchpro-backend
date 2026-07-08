import { IsNumber, IsOptional, Min } from 'class-validator';

// Separate from UpdateProfileDto on purpose — payment updates are a distinct
// action from editing profile details, and keeping the validation rule
// (amountPaid can't exceed feeAgreed) in one place is easier to reason about
// than folding it into the general-purpose profile update path.
export class UpdatePaymentDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  feeAgreed?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amountPaid?: number;
}
