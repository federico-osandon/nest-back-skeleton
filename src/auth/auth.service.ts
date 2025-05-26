import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { 
  CreateUserDto,
  LoginUserDto,
} from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';


@Injectable()
export class AuthService {

    constructor(
        // @InjectRepository(User)
        // private readonly userRepository: Repository<User>,

        private readonly jwtService: JwtService,
        
        private readonly usersService: UsersService
    ) {}


    async create( createUserDto: CreateUserDto ) {   
        try {
            // Delegamos la creación al UsersService
            return await this.usersService.create(createUserDto);
        } catch (error) {
            this.handleDBErrors(error);
        }
    }

    async login( loginUserDto: LoginUserDto ) {

        const { password, email } = loginUserDto;

        const user = await this.usersService.findOneByEmail(email);

        if ( !user ) 
        throw new UnauthorizedException('Credentials are not valid (email)');
        
        if ( !bcrypt.compareSync( password, user.password ) )
        throw new UnauthorizedException('Credentials are not valid (password)');

        return {
            ...user,
            token: this.getJwtToken({ id: user.id })
        };
    }

    async checkAuthStatus( user: User ){

        return {
            ...user,
            token: this.getJwtToken({ id: user.id })
        };

    }


  
    private getJwtToken( payload: JwtPayload ) {
        const token = this.jwtService.sign( payload );
        return token;

    }

    private handleDBErrors( error: any ): never {


        if ( error.code === '23505' ) 
        throw new BadRequestException( error.detail );

        console.log(error)

        throw new InternalServerErrorException('Please check server logs');
    }
}
