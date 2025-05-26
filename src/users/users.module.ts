import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { envs } from 'src/config/envs';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
    controllers: [UsersController],
    providers: [UsersService, JwtStrategy],
    imports: [
        TypeOrmModule.forFeature([User]),
        
        PassportModule.register({ defaultStrategy: 'jwt' }),

        JwtModule.register({
            secret: envs.jwtSecret,
            signOptions: {
                    expiresIn: '24h',
                },
        })
    ],
   
    exports: [UsersService, TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})

export class UsersModule {}
