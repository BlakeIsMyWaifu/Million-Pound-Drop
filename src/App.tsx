import { Center, MantineProvider, Title } from '@mantine/core'

function App() {
	return (
		<MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
			<Center>
				<Title>Million Pound Drop</Title>
			</Center>
		</MantineProvider>
	)
}

export default App
