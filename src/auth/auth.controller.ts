import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBasicAuth } from '@nestjs/swagger';
import { Authorization, Public } from '@app/common/decorator';
import { CreateUserDto } from 'src/users/dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiBasicAuth()
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Public()
  @ApiBasicAuth()
  @Post('signin')
  async signIn(@Authorization() token: string) {
    return await this.authService.signIn(token);
  }
}
