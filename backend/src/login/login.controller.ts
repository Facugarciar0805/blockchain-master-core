import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';

@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}
  @Post()
  signIn(@Body() loginDto: LoginDto) {
    return this.loginService.login(loginDto.email, loginDto.password);
  }
}
