import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    async create(createUserDto: CreateUserDto) {
        try {
            const { password, ...userData} = createUserDto;

            const user = this.userRepository.create({
                ...userData,
                password: bcrypt.hashSync(password, 10)
            })

            await this.userRepository.save(user);
            delete user.password;

            return {
                ...user,
                token: this.getJwtToken({ id: user.id })
            };

        } catch (error) {
            this.handleDBErrors(error);
        }
    }

    async findAll() {
        return await this.userRepository.find();
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    private getJwtToken( payload: JwtPayload ) {
        const token = this.jwtService.sign( payload );
        return token;
    }

    private handleDBErrors (error: any): never {
        if(error.code === '23505') {
            throw new BadRequestException(error.detail);
        }
        console.log(error);
        throw new InternalServerErrorException('Unexpected error, check server logs');
    }


}
