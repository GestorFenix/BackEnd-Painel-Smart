import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateUserController } from './controllers/create-user.controller'
import { DeleteUserController } from './controllers/delete-user-by-id.controller'
import { GetUserByIdController } from './controllers/get-user-by-id.controller'
import { GetUserSessionInfo } from './controllers/get-user-session-info.controller'
import { GetUsersOnlineController } from './controllers/get-users-online.controller'
import { GetUsersController } from './controllers/get-users.controller'
import { UpdateBackground } from './controllers/update-backgrouund.controller'
import { UpdateLogo } from './controllers/update-logo.controller'
import { UpdateClientsLimit } from './controllers/update-user-client-limit.controller'
import { UpdatePasswordController } from './controllers/update-user-password.controller'
import { UpdateUserController } from './controllers/update-user.controller'
import { envSchema } from './env'
import { PrismaService } from './prisma/prisma.service'
import { GetCardsInfo } from './controllers/get-cards-info.controller'

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
    GetUsersOnlineController,
    UpdateClientsLimit,
    GetUserSessionInfo,
    GetCardsInfo,
  ],
})
export class AppModule {}
