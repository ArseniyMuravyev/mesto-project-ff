import { deleteCard, likeCard } from './api'
import { catchError } from './utils'
import { Card, Likes} from '../types/global'

export const createCard = (
	card: Card,
	handleDeleteCard: (cardElement: HTMLElement, cardId: string) => void,
	handleLikeCard: (
		likeButton: HTMLElement,
		likesCountElement: HTMLElement,
		cardId: string,
		currentUserId: string
	) => void,
	openImageModal: (evt: MouseEvent) => void,
	currentUserId: string
): HTMLElement => {
	const cardTemplate = document.querySelector(
		'#card-template'
	) as HTMLTemplateElement
	const cardElement = cardTemplate.content
		.querySelector('.card')
		.cloneNode(true) as HTMLElement
	const cardImage = cardElement.querySelector(
		'.card__image'
	) as HTMLImageElement
	const cardTitle = cardElement.querySelector('.card__title') as HTMLElement
	const deleteButton = cardElement.querySelector(
		'.card__delete-button'
	) as HTMLElement
	const likeButton = cardElement.querySelector(
		'.card__like-button'
	) as HTMLElement
	const likesCountElement = likeButton
		.closest('.card')
		.querySelector('.card__like-amount') as HTMLElement

	if (card.owner && card.owner._id === currentUserId) {
		deleteButton.style.display = 'block'
		deleteButton.addEventListener('click', () =>
			handleDeleteCard(cardElement, card._id)
		)
	} else {
		deleteButton.style.display = 'none'
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

export const handleDeleteCard = (cardElement: HTMLElement, cardId: string) => {
	deleteCard(cardElement, cardId)
		.then(() => cardElement.remove())
		.catch(catchError)
}

export const handleLikeCard = (
	likeButton: HTMLElement,
	likesCountElement: HTMLElement,
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
