import { modalNewCard, newPlaceForm, placesList } from '../index'
import { closeModal, openImageModal } from './modal'

function createCard(card, deleteCard, likeCard) {
	const cardTemplate = document.querySelector('#card-template').content
	const cardElement = cardTemplate.querySelector('.card').cloneNode(true)
	const cardImage = cardElement.querySelector('.card__image')
	const cardTitle = cardElement.querySelector('.card__title')
	const deleteButton = cardElement.querySelector('.card__delete-button')
	const likeButton = cardElement.querySelector('.card__like-button')

	deleteButton.addEventListener('click', () => deleteCard(cardElement))

	likeButton.addEventListener('click', () => likeCard(likeButton))

	cardImage.addEventListener('click', openImageModal)

	cardImage.src = card.link
	cardImage.alt = card.name
	cardTitle.textContent = card.name

	return cardElement
}

function createNewPlace(evt) {
	evt.preventDefault()

	const cardNameInput = document.querySelector('.popup__input_type_card-name')
	const imageUrlInput = document.querySelector('.popup__input_type_url')

	const cardName = cardNameInput.value
	const imageUrl = imageUrlInput.value

	const newCard = {
		name: cardName,
		link: imageUrl
	}

	const cardElement = createCard(newCard, deleteCard, likeCard)

	placesList.prepend(cardElement)

	newPlaceForm.reset()

	closeModal(modalNewCard)
}

const deleteCard = cardElement => cardElement.remove()

const likeCard = likeButton => {
	likeButton.classList.toggle('card__like-button_is-active')
}

export { createCard, createNewPlace, deleteCard, likeCard }
