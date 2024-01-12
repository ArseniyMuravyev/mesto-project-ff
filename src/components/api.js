import { checkResponse } from './utils'

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
	}).then(checkResponse)
}

export const getInitialCards = () => {
	return fetch(`${config.baseUrl}/cards`, {
		headers: config.headers
	}).then(checkResponse)
}

export const updateUserProfile = (name, about) => {
	return fetch(`${config.baseUrl}/users/me`, {
		method: 'PATCH',
		headers: config.headers,
		body: JSON.stringify({
			name,
			about
		})
	}).then(checkResponse)
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
	}).then(checkResponse)
}

export const likeCard = (likeButton, cardId, userId) => {
	return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
		method: likeButton.classList.contains('card__like-button_is-active')
			? 'DELETE'
			: 'PUT',
		headers: config.headers
	}).then(checkResponse)
}

export const deleteCard = (cardElement, cardId) => {
	return fetch(`${config.baseUrl}/cards/${cardId}`, {
		method: 'DELETE',
		headers: config.headers
	}).then(res => {
		if (res.ok) {
			return cardElement.remove()
		}
		return Promise.reject(`Ошибка: ${res.status}`)
	})
}

export const updateAvatar = avatar => {
	return fetch(`${config.baseUrl}/users/me/avatar`, {
		method: 'PATCH',
		headers: config.headers,
		body: JSON.stringify({
			avatar
		})
	}).then(checkResponse)
}

export const renderLoading = isLoading => {
	const submitButton = document.querySelectorAll('.popup__button')
	submitButton.forEach(
		button => (button.textContent = isLoading ? 'Сохранение...' : 'Сохранить')
	)
}
