import { Paper, SimpleGrid, Stack, Text, Title, UnstyledButton } from '@mantine/core'

import { useInGameStore } from './useGameStore'

export default function CategorySelect() {
	const remainingCategories = useInGameStore('remainingCategories')

	return (
		<Stack
			p='xl'
			style={{
				height: '100vh'
			}}
		>
			<Title align='center'>Category</Title>
			<SimpleGrid
				cols={4}
				breakpoints={[{ maxWidth: '62rem', cols: 2, spacing: 'md' }]}
				style={{
					flexGrow: 1
				}}
			>
				{remainingCategories.map((category, i) => {
					return category ? <Category key={i} category={category} /> : <div key={i} />
				})}
			</SimpleGrid>
		</Stack>
	)
}

type CategoryProps = {
	category: string
}

function Category({ category }: CategoryProps) {
	const setActiveQuestion = useInGameStore('setActiveQuestion')

	return (
		<UnstyledButton
			onClick={() => {
				setActiveQuestion(category)
			}}
		>
			<Paper
				withBorder
				style={{
					height: '100%'
				}}
				sx={theme => ({
					'&:hover': {
						backgroundColor: theme.colors[theme.colorScheme][6]
					}
				})}
			>
				<Stack
					justify='center'
					style={{
						height: '100%'
					}}
				>
					<Text align='center' size='xl'>
						{category}
					</Text>
				</Stack>
			</Paper>
		</UnstyledButton>
	)
}
