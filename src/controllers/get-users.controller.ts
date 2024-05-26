import { Controller, Get } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'

@Controller('users')
export class GetUsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async handle() {
    return await this.prisma.users.findMany()
  }
}
