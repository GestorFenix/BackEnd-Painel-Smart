import { ApiProperty } from '@nestjs/swagger'

export class CreateUserBodyDto {
	@ApiProperty({
		example: 'seuemail@mail.com.br',
		description: 'Esse vai ser o email de acesso ao sistema.',
	})
	email: string | undefined

	@ApiProperty({
		example: 'Digite uma senha forte.',
		description: 'Sua senha de acesso ao sistema',
	})
	password: string | undefined

	@ApiProperty({
		example: 'Jorginho das Neves',
		description: 'Um nome para identificar o usuário.',
	})
	name: string | undefined

	@ApiProperty({
		example: '192.0.0.1',
		description: 'DNS que vai ser usado para agrupar os clientes da franquia.',
	})
	dns: string | undefined
}
