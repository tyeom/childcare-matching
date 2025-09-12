import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-auth.dto';
import { UsersService } from 'src/users/users.service';
import { TokenResponseDto } from './dto/token-response.dto';
import { UserSignInDto } from './dto/user-sign-in.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@app/common/enums';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private parseBasicToken(rawToken: string) {
    // 1. ['Basic', $token]
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    const [basic, token] = basicSplit;

    if (basic.toLowerCase() !== 'basic') {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const tokenSplit = decoded.split(':');

    if (tokenSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    const [userId, password] = tokenSplit;

    return {
      userId,
      password,
    };
  }

  private async issueToken(user: { _id: number; role: Role }) {
    const secretKey = this.configService.get<string>('JWT_SECRET_KEY');

    return this.jwtService.signAsync(
      {
        sub: user._id,
        role: user.role,
      },
      {
        secret: secretKey,
        expiresIn: '240h',
      },
    );
  }

  async signup(createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  async signIn(token: string): Promise<TokenResponseDto> {
    const { userId, password } = this.parseBasicToken(token);
    const userSignInDto = new UserSignInDto();
    userSignInDto.userId = userId;
    userSignInDto.password = password;

    const user = await this.usersService.findOneByUserId(userId);
    if (!user) {
      throw new UnauthorizedException('잘못된 계정 정보 입니다.');
    }
    const { id, password: userPassword, role } = user;

    const passwordCheck = await bcrypt.compare(password, userPassword);
    if (!passwordCheck) {
      throw new UnauthorizedException('잘못된 계정 정보 입니다.');
    }

    // 엑세스 토큰 발급
    const tokenResponseDto = new TokenResponseDto();
    tokenResponseDto.token = await this.issueToken({ _id: id, role });
    return tokenResponseDto;
  }
}
