import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller('user/:id')
@ApiTags('Franquias')
export class DeleteUserController {
  constructor(private readonly prisma: PrismaService) {}

  @Delete()
  @ApiOperation({ summary: 'Deleta uma franquia pelo ID' })
  @HttpCode(204)
  async handle(@Param('id') id: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    })

    if (!user) throw new NotFoundException('User not found.')

    await this.prisma.users.delete({
      where: {
        id,
      },
    })
  }
}
