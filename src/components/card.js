import { catchError } from './utils'

export const createCard = (
	card,
	deleteCard,
	likeCard,
	openImageModal,
	currentUserId
) => {
	const cardTemplate = document.querySelector('#card-template').content
	const cardElement = cardTemplate.querySelector('.card').cloneNode(true)
	const cardImage = cardElement.querySelector('.card__image')
	const cardTitle = cardElement.querySelector('.card__title')
	const deleteButton = cardElement.querySelector('.card__delete-button')
	const likeButton = cardElement.querySelector('.card__like-button')
	const likesCountElement = likeButton
		.closest('.card')
		.querySelector('.card__like-amount')
	if (card.owner && card.owner._id === currentUserId) {
		deleteButton.style.display = 'block'
		deleteButton.addEventListener('click', () =>
			deleteCard(cardElement, card._id)
		)
	} else {
		deleteButton.style.display = 'none'
	}

	const isLikedByCurrentUser =
		card.likes && card.likes.some(like => like._id === currentUserId)
	if (isLikedByCurrentUser) {
		likeButton.classList.add('card__like-button_is-active')
	}

	likeButton.addEventListener('click', () => {
		likeCard(likeButton, card._id, currentUserId)
			.then(data => {
				likesCountElement.textContent = data.likes.length
				likeButton.classList.toggle('card__like-button_is-active')
			})
			.catch(catchError)
	})

	cardImage.addEventListener('click', evt => openImageModal(evt))

	cardImage.src = card.link
	cardImage.alt = card.name
	cardTitle.textContent = card.name
	likesCountElement.textContent = card.likes ? card.likes.length : 0

	return cardElement
}
