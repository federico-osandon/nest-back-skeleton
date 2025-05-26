import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(6)
    @MinLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
    
    @IsString()
    @MinLength(1)
    fullName: string;
}
