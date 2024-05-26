import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'

@Controller('user/:id')
export class GetUserByIdController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
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
