import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';

import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';

import type { Response } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

class RegisterDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}

class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('register')
    register(@Body() body: RegisterDto) {
        return this.authService.register(
            body.name,
            body.email,
            body.password,
        );
    }

    @Post('login')
    async login(
        @Body() body: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const result = await this.authService.login(
            body.email,
            body.password,
        );

        const isProduction =
            (process.env.NODE_ENV || '').trim().replace(/^["']|["']$/g, '') === 'production';

        response.cookie('access_token', result.accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return {
            message: 'Login successful',
            user: result.user,
        };
    }

    // Logout
    @Post('logout')
    logout(@Res({ passthrough: true }) response: Response) {
        const isProduction =
            (process.env.NODE_ENV || '').trim().replace(/^["']|["']$/g, '') === 'production';

        response.clearCookie('access_token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
        });

        return {
            message: 'Logout successful',
        };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@Req() request: any) {
        return this.authService.getCurrentUser(
            request.user.userId,
        );
    }
}