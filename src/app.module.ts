import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateUserController } from './controllers/create-user.controller'
import { DeleteUserController } from './controllers/delete-user-by-id.controller'
import { GetUserByIdController } from './controllers/get-user-by-id.controller'
import { UpdatePasswordController } from './controllers/update-user-password.controller'
import { UpdateUserController } from './controllers/update-user.controller'
import { GetUsersController } from './controllers/get-users.controller'
import { UpdateLogo } from './controllers/update-logo.controller'
import { UpdateBackground } from './controllers/update-backgrouund.controller'

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
  providers: [PrismaService],
  controllers: [
    AuthenticateController,
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    GetUsersController,
    UpdatePasswordController,
    UpdateUserController,
    UpdateLogo,
    UpdateBackground,
  ],
})
export class AppModule {}
