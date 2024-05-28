import { Controller, Get } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'

@Controller('users/online')
export class GetUsersOnlineController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async handle() {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000) // milesegundos * segundos * minutos

    return await this.prisma.users.findMany({
      where: {
        lastLogin: { gte: tenMinutesAgo },
      },
    })
  }
}
