import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { Body, Controller, NotFoundException, Param, Put } from '@nestjs/common'
import { z } from 'zod'

const updateUserBodySchema = z.object({
  clientLimit: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(updateUserBodySchema)

type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>

@Controller('user/:id/limit')
export class UpdateClientsLimit {
  constructor(private readonly prisma: PrismaService) { }

  @Put()
  async handle(
    @Body(bodyValidationPipe) body: UpdateUserBodySchema,
    @Param('id') id: string,
  ) {
    const { clientLimit } = body

    const franchise = await this.prisma.franchises.findUnique({
      where: {
        id: Number(id),
      },
    })

    if (!franchise) throw new NotFoundException('Resource not found.')

    await this.prisma.franchises.update({
      where: {
        id: Number(id),
      },
      data: {
        clientLimit: Number(clientLimit),
      },
    })
  }
}
