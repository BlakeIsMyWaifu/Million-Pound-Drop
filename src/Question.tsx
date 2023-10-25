import { NumberInput, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useListState, type UseListStateHandlers } from '@mantine/hooks'
import { useMemo } from 'react'

import { type Question, useInGameStore } from './useGameStore'

type QuestionProps = {
	category: string
	question: Question
}

export default function Question({ category, question }: QuestionProps) {
	// TODO remove options in later rounds
	const options = useMemo(() => {
		const arr = [question.answer, ...question.other]
		for (let i = arr.length - 1; i > 0; i--) {
			const j = ~~(Math.random() * arr.length)
			;[arr[i], arr[j]] = [arr[j], arr[i]]
		}
		return arr
	}, [question])

	const totalRemainingMoney = useInGameStore('remainingMoney')

	const [optionValues, optionValueHandler] = useListState([0, 0, 0, 0])

	const remaining = useMemo(() => {
		const totalSpent = optionValues.reduce((a, b) => a + b, 0)
		return totalRemainingMoney - totalSpent
	}, [optionValues, totalRemainingMoney])

	const maxSelected = useMemo(() => {
		// TODO update when more options are removed
		return optionValues.filter(value => value > 0).length >= 3
	}, [optionValues])

	return (
		<Stack
			p='xl'
			style={{
				height: '100vh'
			}}
		>
			<Title align='center'>{category}</Title>
			<Text align='center'>{question.question}</Text>
			<SimpleGrid breakpoints={[{ maxWidth: '62rem', cols: 2, spacing: 'md' }]} cols={4}>
				{options.map((option, i) => {
					return (
						<Option
							handler={optionValueHandler}
							index={i}
							key={i}
							maxSelected={maxSelected}
							option={option}
							remaining={remaining}
							value={optionValues[i]}
						/>
					)
				})}
			</SimpleGrid>
			<Text align='center'>Remaining Money: £{remaining.toString().replace(moneyRegex, ',')}</Text>
		</Stack>
	)
}

type OptionProps = {
	handler: UseListStateHandlers<number>
	index: number
	maxSelected: boolean
	option: string
	remaining: number
	value: number
}

function Option({ handler, index, maxSelected, option, remaining, value }: OptionProps) {
	return (
		<Paper
			withBorder
			p='xl'
			sx={theme => ({
				backgroundColor: value > 0 ? theme.colors[theme.colorScheme][6] : undefined
			})}
		>
			<Stack
				justify='center'
				style={{
					height: '100%'
				}}
			>
				<Text align='center' size='xl'>
					{option}
				</Text>
				<NumberInput
					disabled={maxSelected && value === 0}
					formatter={value =>
						Number.isNaN(parseFloat(value)) ? '£ ' : `£ ${value}`.replace(moneyRegex, ',')
					}
					max={remaining + value}
					min={0}
					parser={value => value.replace(/\$\s?|(,*)/g, '')}
					step={25_000}
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
