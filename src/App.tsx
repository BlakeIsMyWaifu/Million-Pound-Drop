import { MantineProvider } from '@mantine/core'

import Game from './Game'
import Home from './Home'
import { useGameStore } from './useGameStore'

export default function App() {
	const inGame = useGameStore(state => state.inGame)

	return (
		<MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
			{inGame ? <Game /> : <Home />}
		</MantineProvider>
	)
}
