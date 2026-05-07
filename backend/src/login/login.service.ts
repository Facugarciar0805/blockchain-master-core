import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    private jwtService: JwtService,
  ) {}
  async login(email: string, pass: string) {
    const user = await this.userRepositoryService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email not found');
    }
    if (user.password !== pass) {
      throw new UnauthorizedException('Wrong password');
    }
    // payload ~= token, sub = subject
    // se crea el token con el id y el email del user
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    // payload + secret key = token
    // luego el cliente recibe el token, lo guarda y lo manda al header
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
