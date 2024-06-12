import { PrismaService } from '@/prisma/prisma.service'
import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller('users')
@ApiTags('Franquias')
export class GetUsersController {
  constructor(private readonly prisma: PrismaService) { }

  @Get()
  @ApiOperation({ summary: 'Retorna todos as franquias e suas informções.' })
  async handle() {
    return await this.prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        lastLogin: true,
        Franchises: {
          select: {
            id: true,
            dns: true,
            clientLimit: true,
          },
        },
      },
    })
  }
}
