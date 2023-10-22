import { create, type StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Questions = Record<string, Category>
type Category = {
	answer: string
	other: [string, string, string]
}

type GameStore = GameState & GameAction

type GameState =
	| {
			inGame: false
			questions: null
	  }
	| {
			inGame: true
			questions: Questions
	  }

const gameState: GameState = {
	inGame: false,
	questions: null
}

type GameAction = {
	startGame: (questions: Questions) => void
}

const actionName = (actionName: keyof GameAction): [false, string] => [false, `game/${actionName}`]

const gameAction: StateCreator<GameStore, [['zustand/devtools', never]], [], GameAction> = (set, _get) => ({
	startGame: questions => {
		set({ inGame: true, questions }, ...actionName('startGame'))
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
