import { profileDescription, profileName } from '../index'

const profileAvatar = document.querySelector('.profile__image')

const config = {
	baseUrl: 'https://nomoreparties.co/v1/wff-cohort-5',
	headers: {
		authorization: 'f019a5da-c98f-4c6e-b4b9-d7890c838afb',
		'Content-Type': 'application/json'
	}
}

export const getUserInfo = () => {
	return fetch(`${config.baseUrl}/users/me`, {
		headers: config.headers
	})
		.then(res => {
			if (res.ok) {
				return res.json()
			}
			return Promise.reject(`Ошибка: ${res.status}`)
		})
		.then(data => {
			profileName.textContent = data.name
			profileDescription.textContent = data.about
			profileAvatar.style.backgroundImage = `url(${data.avatar})`
			return data
		})
		.catch(error => {
			console.log(error)
		})
}

export const getInitialCards = () => {
	return fetch(`${config.baseUrl}/cards`, {
		headers: config.headers
	})
		.then(res => {
			if (res.ok) {
				return res.json()
			}
			return Promise.reject(`Ошибка: ${res.status}`)
		})
		.catch(error => {
			console.log(error)
		})
}

export const updateUserProfile = (name, about) => {
	return fetch(`${config.baseUrl}/users/me`, {
		method: 'PATCH',
		headers: config.headers,
		body: JSON.stringify({
			name,
			about
		})
	})
		.then(res => {
			if (res.ok) {
				return res.json()
			}
			return Promise.reject(`Ошибка: ${res.status}`)
		})
		.then(data => {
			profileName.textContent = data.name
			profileDescription.textContent = data.about
		})
		.catch(error => {
			console.log(error)
		})
}

export const postNewCard = (name, link) => {
	return fetch(`${config.baseUrl}/cards`, {
		method: 'POST',
		headers: config.headers,
		body: JSON.stringify({
			name,
			link,
			likes: 0
		})
	})
		.then(res => {
			if (res.ok) {
				return res.json()
			}
			return Promise.reject(`Ошибка: ${res.status}`)
		})
		.catch(error => {
			console.log(error)
		})
}

export const likeCard = (likeButton, cardId) => {
	const likesCountElement = likeButton.nextElementSibling

	fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
		method: likeButton.classList.contains('card__like-button_is-active')
			? 'DELETE'
			: 'PUT',
		headers: config.headers
	})
		.then(res => {
			if (res.ok) {
				return res.json()
			}
			return Promise.reject(`Ошибка: ${res.status}`)
		})
		.then(data => {
			likesCountElement.textContent = data.likes.length
			likeButton.classList.toggle('card__like-button_is-active')
		})
		.catch(error => {
			console.log(error)
		})
}

export const deleteCard = (cardElement, cardId) => {
	return fetch(`${config.baseUrl}/cards/${cardId}`, {
		method: 'DELETE',
		headers: config.headers
	})
		.then(res => {
			if (res.ok) {
				return cardElement.remove()
			}
			return Promise.reject(`Ошибка: ${res.status}`)
		})
		.catch(error => {
			console.log(error)
		})
}

export const updateAvatar = avatar => {
	return fetch(`${config.baseUrl}/users/me/avatar`, {
		method: 'PATCH',
		headers: config.headers,
		body: JSON.stringify({
			avatar
		})
	})
		.then(res => {
			if (res.ok) {
				return res.json()
			}
			return Promise.reject(`Ошибка: ${res.status}`)
		})
		.then(data => {
			profileAvatar.style.backgroundImage = `url(${data.avatar})`
		})
		.catch(error => {
			console.log(error)
		})
}

export const renderLoading = isLoading => {
	const submitButton = document.querySelector('.popup__button')
	submitButton.textContent = isLoading ? 'Сохранение...' : 'Сохранить'
}
