import {
	confirmationModal,
	handleConfirmationModal,
	modalNewCard,
	newPlaceForm,
	placesList
} from '../index'
import { deleteCard, likeCard, postNewCard, renderLoading } from './api'
import { closeModal, openImageModal, openModal } from './modal'

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
	const likesCountElement = likeButton.nextElementSibling
	if (card.owner && card.owner._id === currentUserId) {
		deleteButton.style.display = 'block'
		deleteButton.addEventListener('click', () => {
			if (card._id) {
				openModal(confirmationModal)
				confirmationModal.addEventListener('submit', evt => {
					handleConfirmationModal(evt, cardElement, card._id)
				})
			} else {
				console.log('Card ID is not available yet.')
			}
		})
	} else {
		deleteButton.style.display = 'none'
	}

	const isLikedByCurrentUser = card.likes && card.likes.some(
		like => like._id === currentUserId
	)
	if (isLikedByCurrentUser) {
		likeButton.classList.add('card__like-button_is-active')
	}

	likeButton.addEventListener('click', () => {
		if (card._id) {
			likeCard(likeButton, card._id)
		} else {
			console.log('Card ID is not available yet.')
		}
	})

	cardImage.addEventListener('click', evt => openImageModal(evt))

	cardImage.src = card.link
	cardImage.alt = card.name
	cardTitle.textContent = card.name
	likesCountElement.textContent = card.likes ? card.likes.length : 0

	return cardElement
}

export const createNewPlace = evt => {
	evt.preventDefault()
	renderLoading(true)
	const cardNameInput = document.querySelector('.popup__input_type_card-name')
	const imageUrlInput = document.querySelector('.popup__input_type_url')

	const cardName = cardNameInput.value
	const imageUrl = imageUrlInput.value

	const newCard = {
		name: cardName,
		link: imageUrl
	}

	const cardElement = createCard(newCard, deleteCard, likeCard, openImageModal)

	placesList.prepend(cardElement)
	postNewCard(cardName, imageUrl).finally(() => renderLoading(false))

	newPlaceForm.reset()

	closeModal(modalNewCard)
}
