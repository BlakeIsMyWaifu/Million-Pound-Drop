import CategorySelect from './CategorySelect'
import { useInGameStore } from './useGameStore'

export default function Game() {
	const activeQuestion = useInGameStore('activeQuestion')

	return <CategorySelect />
}
