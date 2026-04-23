import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_PASSWORD'),
                signOptions: { expiresIn: '1h' },
            }),
        }),
    ],
    providers: [AuthGuard],
    exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
