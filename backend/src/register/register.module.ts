import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { UserRepositoryModule } from '../repository/user/user.repository.module';

@Module({
  imports: [UserRepositoryModule],
  controllers: [RegisterController],
  providers: [RegisterService],
  exports: [RegisterService],
})
export class RegisterModule {}
