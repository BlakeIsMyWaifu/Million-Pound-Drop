import { create, type StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Questions = Record<string, Question>
export type Question = {
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
			activeQuestion: Question | null
			remainingCategories: (string | null)[]
	  }
type ActiveGameState = GameState & { inGame: true }

const gameState: GameState = {
	inGame: false
}

type GameAction = {
	startGame: (questions: Questions) => void
	setActiveQuestion: (category: string) => void
}

const actionName = (actionName: keyof GameAction): [false, string] => [false, `game/${actionName}`]

const gameAction: StateCreator<GameStore, [['zustand/devtools', never]], [], GameAction> = (set, get) => ({
	startGame: questions => {
		if (get().inGame) return
		set(
			{
				inGame: true,
				questions,
				round: 1,
				activeQuestion: null,
				remainingCategories: Object.keys(questions)
			} satisfies ActiveGameState,
			...actionName('startGame')
		)
	},
	setActiveQuestion: category => {
		const state = get()
		if (!state.inGame) return
		set({ activeQuestion: state.questions[category] })
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
