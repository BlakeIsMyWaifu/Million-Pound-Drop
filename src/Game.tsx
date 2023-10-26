import CategorySelect from './CategorySelect'
import Question from './Question'
import { useInGameStore } from './useGameStore'

export default function Game() {
	const activeCategory = useInGameStore('activeCategory')

	return activeCategory ? <Question /> : <CategorySelect />
}
