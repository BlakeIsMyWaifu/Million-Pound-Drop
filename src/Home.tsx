import { Button, Center, Modal, Stack, Text, Title } from '@mantine/core'
import { useRef, useState } from 'react'

import { type Questions, useGameStore } from './useGameStore'

export default function Home() {
	return (
		<Center
			style={{
				height: '100vh'
			}}
		>
			<Stack>
				<Title>Million Pound Drop</Title>
				<ImportQuestions />
			</Stack>
		</Center>
	)
}

function ImportQuestions() {
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [modalMessage, setModalMessage] = useState('')
	const [modalState, setModalState] = useState(false)

	const setInGame = useGameStore(state => state.startGame)

	return (
		<>
			<Button
				onClick={() => {
					fileInputRef.current?.click()
				}}
			>
				Import Questions
			</Button>

			<input
				hidden
				ref={fileInputRef}
				type='file'
				accept='application/json'
				onInput={event => {
					const reader = new FileReader()
					reader.onload = event => {
						try {
							const result = event.target?.result
							isString(result)
							const json = JSON.parse(result) as object
							validateQuestions(json)
							setInGame(json)
						} catch (error) {
							if (error instanceof Error) {
								console.error(error)
								setModalMessage(error.message)
								setModalState(true)
							}
						}
					}
					const { files } = event.target as HTMLInputElement
					if (files) reader.readAsText(files[0])
				}}
			/>

			<ErrorModal message={modalMessage} state={modalState} setState={setModalState} />
		</>
	)
}

function isString(value: unknown): asserts value is string {
	if (typeof value !== 'string') throw new Error('value is not a string')
}

function validateQuestions(json: object): asserts json is Questions {
	const questions = Object.values(json)
	if (questions.length !== 8) throw new Error('Invalid amount of categories')
	questions.forEach((question: Questions['']) => {
		isString(question.answer)
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (question.other.length !== 3) throw new Error('Invalid amount of other answers')
		isString(question.other[0])
		isString(question.other[1])
		isString(question.other[2])
	})
}

type ErrorModalProps = {
	message: string
	state: boolean
	setState: (state: boolean) => void
}

function ErrorModal({ message, state, setState }: ErrorModalProps) {
	return (
		<Modal
			centered
			opened={state}
			title='Import Question Error'
			onClose={() => {
				setState(false)
			}}
		>
			<Text color='red'>{message}</Text>
		</Modal>
	)
}
