import { Button, Stack, Text, Title } from '@mantine/core'

import CategorySelect from './CategorySelect'
import Question from './Question'
import { useInGameStore } from './useGameStore'

export default function Game() {
	const remainingMoney = useInGameStore('remainingMoney')
	const activeCategory = useInGameStore('activeCategory')
	const remainingCategories = useInGameStore('remainingCategories')
	const endGame = useInGameStore('endGame')

	if (!remainingMoney)
		return (
			<Stack align='center' justify='center' style={{ height: '100vh' }}>
				<Title>Game Over</Title>
				<Text>You answered {7 - remainingCategories.filter(Boolean).length} / 8 questions correctly</Text>
				<Button onClick={endGame}>Restart</Button>
			</Stack>
		)

	if (!remainingCategories.filter(Boolean).length && !activeCategory) {
		return (
			<Stack align='center' justify='center' style={{ height: '100vh' }}>
				<Title>You Win!</Title>
				<Text>Remaining Money: £{remainingMoney}</Text>
				<Button onClick={endGame}>Restart</Button>
			</Stack>
		)
	}

	return activeCategory ? <Question /> : <CategorySelect />
}
