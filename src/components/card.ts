import { likeCard } from './api'
import { catchError } from './utils'

export interface Card {
	owner: {
		_id: string
	}
	likes?: {
		_id: string
	}[]
	_id: string
	link: string
	name: string
}

interface Likes {
	name: string
	about: string
	avatar: string
	_id: string
	cohort: string
}

export const createCard = (
	card: Card,
	handleDeleteCard: (cardElement: HTMLLIElement, cardId: string) => void,
	handleLikeCard: (
		likeButton: HTMLButtonElement,
		likesCountElement: HTMLSpanElement,
		cardId: string,
		currentUserId: string
	) => void,
	openImageModal: (evt: MouseEvent) => void,
	currentUserId: string
): HTMLLIElement => {
	const cardTemplate: HTMLTemplateElement =
		document.querySelector('#card-template')
	const cardElement = cardTemplate.content
		.querySelector('.card')
		.cloneNode(true) as HTMLLIElement
	const cardImage: HTMLImageElement = cardElement.querySelector('.card__image')
	const cardTitle: HTMLTitleElement = cardElement.querySelector('.card__title')
	const deleteButton: HTMLButtonElement = cardElement.querySelector(
		'.card__delete-button'
	)
	const likeButton: HTMLButtonElement =
		cardElement.querySelector('.card__like-button')
	const likesCountElement: HTMLSpanElement = likeButton
		.closest('.card')
		.querySelector('.card__like-amount')

	if (card.owner && card.owner._id === currentUserId) {
		deleteButton.addEventListener('click', () =>
			handleDeleteCard(cardElement, card._id)
		)
	} else {
		deleteButton.remove()
	}

	const isLikedByCurrentUser =
		card.likes && card.likes.some(like => like._id === currentUserId)
	if (isLikedByCurrentUser) {
		likeButton.classList.add('card__like-button_is-active')
	}

	likeButton.addEventListener('click', () =>
		handleLikeCard(likeButton, likesCountElement, card._id, currentUserId)
	)

	cardImage.addEventListener('click', evt => openImageModal(evt))

	cardImage.src = card.link
	cardImage.alt = card.name
	cardTitle.textContent = card.name
	likesCountElement.textContent = (
		card.likes ? card.likes.length : 0
	).toString()

	return cardElement
}

export const handleDeleteCardClick = (cardElement: HTMLLIElement) => {
	cardElement.remove()
}

export const handleLikeCard = (
	likeButton: HTMLButtonElement,
	likesCountElement: HTMLSpanElement,
	cardId: string,
	currentUserId: string
) => {
	likeCard(likeButton, cardId, currentUserId)
		.then((data: { likes: Likes[] }) => {
			likesCountElement.textContent = data.likes.length.toString()
			likeButton.classList.toggle('card__like-button_is-active')
		})
		.catch(catchError)
}
