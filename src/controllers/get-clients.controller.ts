import { CurrentUser } from '@/auth/current-user-decorator'
import { PrismaService } from '@/prisma/prisma.service'
import { Controller, Get, NotFoundException } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserSessionInfo } from './get-user-session-info.controller'

@Controller('clients')
@ApiTags('Clientes')
export class GetUsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({
    summary: 'Retorna todos os clientes da franquia e suas informções.',
  })
  async handle(@CurrentUser() user: UserSessionInfo) {
    const franchise = await this.prisma.users.findUnique({
      where: {
        id: user.sub,
      },
    })

    if (!franchise) return new NotFoundException()

    return await this.prisma.clients.findMany({
      where: {
        dnsGroup: franchise.dns,
      },
      select: {
        email: true,
        description: true,
        name: true,
        lastLogin: true,
        dnsGroup: true,
      },
    })
  }
}
