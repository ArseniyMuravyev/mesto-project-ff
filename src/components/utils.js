export function checkResponse(res) {
	if (res.ok) {
		return res.json()
	}
	return Promise.reject(`Ошибка: ${res.status}`)
}

export const catchError = error => console.log(error)