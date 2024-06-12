import { CurrentUser } from '@/auth/current-user-decorator'
import { PrismaService } from '@/prisma/prisma.service'
import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

interface UserSessionInfo {
  sub: string
}

@Controller('session')
@ApiTags('Franquias')
export class GetUserSessionInfo {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna todos as franquias e suas informções.' })
  async handle(@CurrentUser() user: UserSessionInfo) {
    return await this.prisma.users.findFirst({
      where: {
        id: user.sub,
      },
      select: {
        email: true,
        name: true,
        isAdm: true,
      },
    })
  }
}
