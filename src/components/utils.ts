export function checkResponse<T>(res: Response): Promise<T> {
	if (res.ok) {
		return res.json()
	}
	return Promise.reject(`Ошибка: ${res.status}`)
}

export const catchError = (error: string): void => console.log(error)
