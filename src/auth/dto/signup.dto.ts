import { IsEmail, IsString, Length, Matches, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&;:#^()_+\-=\[\]{}'",.<>\/\\|`~])[A-Za-z\d@$!%*?&;:#^()_+\-=\[\]{}'",.<>\/\\|`~]+$/,
    {
      message:
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  readonly password: string;
}
