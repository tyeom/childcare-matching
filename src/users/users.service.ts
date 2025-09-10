import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@app/common/enums';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly saltOrRounds: number = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    try {
      // 서비스 최초 실행시 기본 최고 관리자 계정 [Admin] 추가
      await this.createDefaultAdmin();
      // 서비스 최초 실행시 기본 학부모 계정 [PARENTS] 추가
      await this.createDefaultParents();
      // Auth 서비스 최초 실행시 기본 선생님 계정 [TEACHER] 추가
      await this.createDefaultTeacher();
    } catch (error) {
      console.error('onModuleInit ERROR =>', error);
    }
  }

  /**
   * 기본 관리자 계정 추가 [Database]
   */
  private async createDefaultAdmin() {
    try {
      console.log('최고 관리자 계정 존재 여부 체크');
      const adminUser = await this.findOneByUserId('admin');

      if (adminUser) {
        console.warn('기본 관리자 계정 존재함');
        return;
      }

      const hash = await this.getHashRounds('1234');
      const userDto: CreateUserDto = new CreateUserDto();
      userDto.userId = 'admin';
      userDto.userName = '관리자';
      userDto.phone = '+821012345678';
      userDto.password = hash;
      userDto.email = 'admin@a.com';
      userDto.role = Role.ADMIN;

      const createdAdminUser = await this.userRepository.save({
        ...userDto,
        password: hash,
      });

      if (!createdAdminUser) {
        console.error('기본 관리자 계정 생성 오류!');
      } else {
        console.log('기본 관리자 계정 생성 완료');
      }
    } catch (error) {
      console.error('createDefaultAdmin ERROR =>', error);
      throw error;
    }
  }

  /**
   * 기본 학부모 계정 추가 [Database]
   */
  private async createDefaultParents() {
    try {
      console.log('학부모 계정 존재 여부 체크');
      const parentsUser = await this.findOneByUserId('parents1');

      if (parentsUser) {
        console.warn('기본 학부모 계정 존재함');
        return;
      }

      const hash = await this.getHashRounds('1234');
      const userDto: CreateUserDto = new CreateUserDto();
      userDto.userId = 'parents1';
      userDto.userName = '학부모1(기본)';
      userDto.phone = '+821012345678';
      userDto.password = hash;
      userDto.email = 'parents1@a.com';
      userDto.role = Role.PARENTS;

      const createdParentsUser = await this.userRepository.save({
        ...userDto,
        password: hash,
      });

      if (!createdParentsUser) {
        console.error('기본 학부모 계정 생성 오류!');
      } else {
        console.log('기본 학부모 계정 생성 완료');
      }
    } catch (error) {
      console.error('createDefaultParents ERROR =>', error);
      throw error;
    }
  }

  private async createDefaultTeacher() {
    try {
      console.log('선생님 계정 존재 여부 체크');
      const teacherUser = await this.findOneByUserId('teacher1');

      if (teacherUser) {
        console.warn('기본 선생님 계정 존재함');
        return;
      }

      const hash = await this.getHashRounds('1234');
      const userDto: CreateUserDto = new CreateUserDto();
      userDto.userId = 'teacher1';
      userDto.userName = '선생님1(기본)';
      userDto.phone = '+82101230000';
      userDto.password = hash;
      userDto.email = 'teacher1@a.com';
      userDto.role = Role.TEACHER;

      const createdTeacherUser = await this.userRepository.save({
        ...userDto,
        password: hash,
      });

      if (!createdTeacherUser) {
        console.error('기본 선생님 계정 생성 오류!');
      } else {
        console.log('기본 선생님 계정 생성 완료');
      }
    } catch (error) {
      console.error('createDefaultTeacher ERROR =>', error);
      throw error;
    }
  }

  private async getHashRounds(plainVal: string): Promise<string> {
    const hash = await bcrypt.hash(plainVal, this.saltOrRounds);
    return hash;
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    return user;
  }

  async findOneByUserId(userId: string) {
    const user = await this.userRepository.findOne({
      where: { userId },
    });

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { userId: createUserDto.userId },
    });

    if (user) {
      throw new BadRequestException('이미 존재 하는 아이디 입니다.');
    }

    const hash = await this.getHashRounds(createUserDto.password);
    await this.userRepository.save({
      ...createUserDto,
      password: hash,
    });

    // 생성된 user정보 반환
    return await this.userRepository.findOne({
      where: { userId: createUserDto.userId },
    });
  }

  async createAdminUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { userId: createUserDto.userId },
    });

    if (user) {
      throw new BadRequestException('이미 존재 하는 아이디 입니다.');
    }

    const hash = await this.getHashRounds(createUserDto.password);
    await this.userRepository.save({
      ...createUserDto,
      password: hash,
    });

    // 생성된 user정보 반환
    return await this.userRepository.findOne({
      where: { userId: createUserDto.userId },
    });
  }
}
