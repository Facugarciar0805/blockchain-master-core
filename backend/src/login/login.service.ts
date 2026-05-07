import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {UserRepositoryService} from "../repository/user/user.repository.service";

@Injectable()
export class LoginService {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepositoryService,
  ) {}
  async login(email: string, pass: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email not found');
    }
    if (user.password !== pass) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
