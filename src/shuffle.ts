export const shuffle = <T extends unknown[]>(arr: T): T => {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = ~~(Math.random() * arr.length)
		;[arr[i], arr[j]] = [arr[j], arr[i]]
	}
	return arr
}
