import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common'
import { compare, hash } from 'bcryptjs'
import { z } from 'zod'

const updatePasswordBodySchema = z.object({
  password: z.string(),
  newPassword: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(updatePasswordBodySchema)

type UpdatePasswordBodySchema = z.infer<typeof updatePasswordBodySchema>

@Controller('user/:id/password')
export class UpdatePasswordController {
  constructor(private readonly prisma: PrismaService) { }

  @Put()
  async handle(
    @Body(bodyValidationPipe) body: UpdatePasswordBodySchema,
    @Param('id') id: string,
  ) {
    const { password, newPassword } = body

    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    })

    if (!user) throw new NotFoundException('User not found.')

    const isOldPasswordMatches = await compare(password, user.password!)

    if (!isOldPasswordMatches)
      throw new UnauthorizedException('Wrong credentials.')

    await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        password: await hash(newPassword, 8),
      },
    })
  }
}
