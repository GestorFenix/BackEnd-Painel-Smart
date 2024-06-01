import { Controller, Get } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller('users/online')
@ApiTags('Franquias')
export class GetUsersOnlineController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna todos os usuários que estão online.' })
  async handle() {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000) // milesegundos * segundos * minutos

    return await this.prisma.users.findMany({
      where: {
        lastLogin: { gte: tenMinutesAgo },
      },
    })
  }
}
