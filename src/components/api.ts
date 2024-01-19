import { Config } from '../types/global.d'
import { checkResponse } from './utils'

const config: Config = {
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

export const updateUserProfile = (name: string, about: string) => {
	return fetch(`${config.baseUrl}/users/me`, {
		method: 'PATCH',
		headers: config.headers,
		body: JSON.stringify({
			name,
			about
		})
	}).then(checkResponse)
}

export const postNewCard = (name: string, link: string) => {
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

export const likeCard = (
	likeButton: HTMLButtonElement,
	cardId: string,
	userId: string
) => {
	return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
		method: likeButton.classList.contains('card__like-button_is-active')
			? 'DELETE'
			: 'PUT',
		headers: config.headers
	}).then(checkResponse)
}

export const deleteCard = (cardElement: HTMLLIElement, cardId: string) => {
	return fetch(`${config.baseUrl}/cards/${cardId}`, {
		method: 'DELETE',
		headers: config.headers
	}).then(checkResponse)
}

export const updateAvatar = (avatar: string) => {
	return fetch(`${config.baseUrl}/users/me/avatar`, {
		method: 'PATCH',
		headers: config.headers,
		body: JSON.stringify({
			avatar
		})
	}).then(checkResponse)
}
