import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'
import { Public } from '@/auth/public'
import { compare } from 'bcryptjs'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

// const response = await fetch(
//   `http://spacee.icu:80/player_api.php?username=sauldev616&password=8301643cgt`,
// )

@Controller('login')
@Public()
@UsePipes(new ZodValidationPipe(authenticateBodySchema))
export class AuthenticateController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  @Post()
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.users.findUnique({
      where: {
        email,
      },
    })

    if (!user) throw new UnauthorizedException('Invalid credentials.')

    const isPasswordMathes = await compare(password, user.password!)

    if (!isPasswordMathes)
      throw new UnauthorizedException('Invalid credentials.')

    const token = this.jwt.sign({ sub: user.id })

    return {
      token,
    }
  }
}
