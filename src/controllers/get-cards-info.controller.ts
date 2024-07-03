import { CurrentUser } from '@/auth/current-user-decorator'
import { PrismaService } from '@/prisma/prisma.service'
import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

export interface UserSessionInfo {
  sub: string
}

@Controller('cards')
@ApiTags('Franquias')
export class GetCardsInfo {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna todas as informções dos cards.' })
  async handle(@CurrentUser() user: UserSessionInfo) {
    const totalClients = await this.prisma.clients.count()
    const totalUsers = await this.prisma.users.count()

    return {
      totalClients,
      totalUsers,
    }
  }
}
