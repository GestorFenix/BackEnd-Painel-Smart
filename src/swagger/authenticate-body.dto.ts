import { ApiProperty } from '@nestjs/swagger'

export class AuthenticateBodyDto {
  @ApiProperty({
    example: 'seuemail@mail.com.br',
    description: 'Esse vai ser o email de acesso ao sistema.',
  })
  email: string | undefined

  @ApiProperty({
    example: '****************',
    description: 'Sua senha de acesso ao sistema',
  })
  password: string | undefined
}
