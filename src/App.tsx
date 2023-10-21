import { MantineProvider } from '@mantine/core'
import Home from './Home'

export default function App() {
	return (
		<MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
			<Home />
		</MantineProvider>
	)
}
