import { Controller, Get } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
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
        email: true,
        name: true,
        lastLogin: true,
        Franchises: {
          select: {
            dns: true,
          },
        },
      },
    })
  }
}
