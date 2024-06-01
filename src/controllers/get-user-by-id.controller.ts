import { PrismaService } from '@/prisma/prisma.service'
import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller('user/:id')
@ApiTags('Franquias')
export class GetUserByIdController {
  constructor(private readonly prisma: PrismaService) { }

  @Get()
  @ApiOperation({ summary: 'Retorna as informações de uma franquia pelo ID' })
  async handle(@Param('id') id: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    })

    if (!user) throw new NotFoundException('User not found.')

    return await this.prisma.users.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        email: true,
        Franchises: true,
      },
    })
  }
}
