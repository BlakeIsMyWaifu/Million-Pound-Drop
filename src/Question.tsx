import { ActionIcon, Button, Group, NumberInput, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useListState, type UseListStateHandlers } from '@mantine/hooks'
import { IconCurrencyPound, IconReload } from '@tabler/icons-react'
import { useCallback, useMemo } from 'react'

import { shuffle } from './shuffle'
import { type Question, useInGameStore } from './useGameStore'

export default function Question() {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { category, question } = useInGameStore('activeCategory')!

	const roundNumber = 8 - useInGameStore('remainingCategories').filter(Boolean).length
	const optionCount = roundNumber >= 6 ? (roundNumber >= 8 ? 2 : 3) : 4

	const options = useMemo(() => {
		const other: string[] = question.other
		other.length = optionCount - 1
		const arr = [question.answer, ...other]
		return shuffle(arr)
	}, [optionCount, question.answer, question.other])

	const totalRemainingMoney = useInGameStore('remainingMoney')

	const [optionValues, optionValueHandler] = useListState([0, 0, 0, 0])

	const remaining = useMemo(() => {
		const totalSpent = optionValues.reduce((a, b) => a + b, 0)
		return totalRemainingMoney - totalSpent
	}, [optionValues, totalRemainingMoney])

	const setRemainingMoney = useInGameStore('setRemainingMoney')
	const setActiveCategory = useInGameStore('setActiveCategory')
	const handleSubmit = useCallback(() => {
		const correctAnswerIndex = options.findIndex(option => option === question.answer)
		setRemainingMoney(optionValues[correctAnswerIndex])
		setActiveCategory(null)
	}, [optionValues, options, question.answer, setActiveCategory, setRemainingMoney])

	return (
		<Stack align='center' justify='center' p='xl' style={{ height: '100vh' }}>
			<Title align='center'>{category.split('---')[0]}</Title>
			<Text align='center'>{question.question}</Text>
			<SimpleGrid breakpoints={[{ maxWidth: '62rem', cols: 2, spacing: 'md' }]} cols={optionCount}>
				{options.map((option, i) => {
					return (
						<Option
							handler={optionValueHandler}
							index={i}
							key={i}
							lastRound={roundNumber === 8}
							maxSelected={optionValues.filter(value => value > 0).length >= optionCount - 1}
							option={option}
							remaining={remaining}
							value={optionValues[i]}
						/>
					)
				})}
			</SimpleGrid>
			<Group position='center'>
				<Text align='center'>Remaining Money: £{remaining.toString().replace(moneyRegex, ',')}</Text>
				<ResetMoney handler={optionValueHandler} />
			</Group>
			<Submit handleSubmit={handleSubmit} remaining={remaining} />
		</Stack>
	)
}

type OptionProps = {
	handler: UseListStateHandlers<number>
	index: number
	lastRound: boolean
	maxSelected: boolean
	option: string
	remaining: number
	value: number
}

function Option({ handler, index, lastRound, maxSelected, option, remaining, value }: OptionProps) {
	return (
		<Paper
			withBorder
			p='xl'
			sx={theme => ({
				backgroundColor: value > 0 ? theme.colors[theme.colorScheme][6] : undefined
			})}
		>
			<Stack justify='center' style={{ height: '100%' }}>
				<Text align='center' size='xl'>
					{option}
				</Text>
				<NumberInput
					disabled={maxSelected && value === 0}
					formatter={value => (Number.isNaN(parseFloat(value)) ? '' : `${value}`.replace(moneyRegex, ','))}
					icon={<IconCurrencyPound size='1rem' />}
					max={remaining + value}
					min={0}
					parser={value => value.replace(/\$\s?|(,*)/g, '')}
					step={lastRound ? remaining + value : 25_000}
					stepHoldDelay={500}
					stepHoldInterval={t => Math.max(1000 / t ** 2, 25)}
					value={value}
					onChange={event => {
						handler.setItem(index, +event)
					}}
				/>
			</Stack>
		</Paper>
	)
}

const moneyRegex = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g

type ResetMoneyProps = {
	handler: UseListStateHandlers<number>
}

function ResetMoney({ handler }: ResetMoneyProps) {
	return (
		<ActionIcon
			variant='light'
			onClick={() => {
				handler.setState([0, 0, 0, 0])
			}}
		>
			<IconReload size='1rem' />
		</ActionIcon>
	)
}

type SubmitProps = {
	remaining: number
	handleSubmit: () => void
}

function Submit({ remaining, handleSubmit }: SubmitProps) {
	return (
		<Button disabled={remaining !== 0} onClick={handleSubmit}>
			Submit
		</Button>
	)
}
