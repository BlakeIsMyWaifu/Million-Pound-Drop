import { create, type StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Questions = Record<string, Question>
export type Question = {
	question: string
	answer: string
	other: [string, string, string]
}

type GameStore = GameState & GameAction

type GameState =
	| {
			inGame: false
	  }
	| {
			inGame: true
			questions: Questions
			round: number
			activeCategory: { category: string; question: Question } | null
			remainingCategories: (string | null)[]
			remainingMoney: number
	  }
type ActiveGameState = GameState & { inGame: true }

const gameState: GameState = {
	inGame: false
}

type GameAction = {
	startGame: (questions: Questions) => void
	endGame: () => void
	setActiveCategory: (category: string | null) => void
	setRemainingMoney: (amount: number) => void
}

const actionName = (actionName: keyof GameAction, replace = false): [boolean, string] => [replace, `game/${actionName}`]

const gameAction: StateCreator<GameStore, [['zustand/devtools', never]], [], GameAction> = (set, get) => ({
	startGame: questions => {
		if (get().inGame) return
		set(
			{
				inGame: true,
				questions,
				round: 1,
				activeCategory: null,
				remainingCategories: Object.keys(questions),
				remainingMoney: 1_000_000
			} satisfies ActiveGameState,
			...actionName('startGame')
		)
	},
	endGame: () => {
		if (!get().inGame) return
		set({ inGame: false }, ...actionName('endGame'))
	},
	setActiveCategory: category => {
		const state = get()
		if (!state.inGame) return
		set(
			{
				activeCategory: category ? { category, question: state.questions[category] } : null,
				remainingCategories: state.remainingCategories.map(remainingCategory => {
					return remainingCategory === category ? null : remainingCategory
				})
			},
			...actionName('setActiveCategory')
		)
	},
	setRemainingMoney: amount => {
		const state = get()
		if (!state.inGame) return
		set({ remainingMoney: amount }, ...actionName('setRemainingMoney'))
	}
})

export const useGameStore = create<GameStore>()(
	devtools(
		(...a) => ({
			...gameState,
			...gameAction(...a)
		}),
		{ name: 'Game' }
	)
)

/** Must only be used when inGame is known to be true */
export const useInGameStore = <T extends keyof (ActiveGameState & GameAction)>(key: T) => {
	return useGameStore(state => (state as ActiveGameState & GameAction)[key])
}
