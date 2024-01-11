import {
	deleteCard,
	getInitialCards,
	getUserInfo,
	likeCard,
	renderLoading,
	updateAvatar,
	updateUserProfile
} from './components/api'
import { createCard, createNewPlace } from './components/card'
import { closeModal, openImageModal, openModal } from './components/modal'
import { clearValidation, enableValidation } from './components/validation.js'
import './pages/index.css'

const editForm = document.forms.edit_profile
const newPlaceForm = document.forms.new_place
const editAvatarForm = document.querySelector('.popup_type_avatar')
const editButton = document.querySelector('.profile__edit-button')
const addButton = document.querySelector('.profile__add-button')
const modalEdit = document.querySelector('.popup_type_edit')
const nameInput = editForm.querySelector('.popup__input_type_name')
const jobInput = editForm.querySelector('.popup__input_type_description')
const avatarInput = document.querySelector('.popup__input_type_avatar_url')
const profileName = document.querySelector('.profile__title')
const profileDescription = document.querySelector('.profile__description')
const placesList = document.querySelector('.places__list')
const modalNewCard = document.querySelector('.popup_type_new-card')
const profileImage = document.querySelector('.profile__image')
const confirmationModal = document.querySelector('.popup_type_delete_card')

profileImage.addEventListener('click', () => {
	openModal(editAvatarForm)
	clearValidation(editAvatarForm, editAvatarFormSettings)
})

editButton.addEventListener('click', () => {
	openModal(modalEdit)
	clearValidation(editForm, editFormSettings)
	setFormValues()
})

addButton.addEventListener('click', () => {
	openModal(modalNewCard)
	clearValidation(newPlaceForm, newPlaceFormSettings)
})

const setFormValues = () => {
	nameInput.value = profileName.textContent
	jobInput.value = profileDescription.textContent
}

const handleFormSubmit = evt => {
	evt.preventDefault()
	renderLoading(true)
	updateUserProfile(nameInput.value, jobInput.value).finally(() =>
		renderLoading(false)
	)

	closeModal(modalEdit)
}

const handleAvatarFormSubmit = evt => {
	evt.preventDefault()
	renderLoading(true)
	updateAvatar(avatarInput.value).finally(() => renderLoading(false))

	closeModal(editAvatarForm)
}

const handleConfirmationModal = (evt, cardElement, cardId) => {
	evt.preventDefault()
	deleteCard(cardElement, cardId)

	closeModal(confirmationModal)
}

editAvatarForm.addEventListener('submit', handleAvatarFormSubmit)
editForm.addEventListener('submit', handleFormSubmit)
newPlaceForm.addEventListener('submit', createNewPlace)

const editFormSettings = {
	formSelector: '.popup_type_edit .popup__form',
	inputSelector: '.popup_type_edit .popup__input',
	submitButtonSelector: '.popup_type_edit .popup__button',
	inactiveButtonClass: 'popup__button_disabled',
	inputErrorClass: 'popup__input_type_error',
	errorClass: 'popup__error_visible'
}

const newPlaceFormSettings = {
	formSelector: '.popup_type_new-card .popup__form',
	inputSelector: '.popup_type_new-card .popup__input',
	submitButtonSelector: '.popup_type_new-card .popup__button',
	inactiveButtonClass: 'popup__button_disabled',
	inputErrorClass: 'popup__input_type_error',
	errorClass: 'popup__error_visible'
}

const editAvatarFormSettings = {
	formSelector: '.popup_type_avatar .popup__form',
	inputSelector: '.popup_type_avatar .popup__input',
	submitButtonSelector: '.popup_type_avatar .popup__button',
	inactiveButtonClass: 'popup__button_disabled',
	inputErrorClass: 'popup__input_type_error',
	errorClass: 'popup__error_visible'
}

const renderCards = (cards, currentUserId) => {
	cards.forEach(card => {
		const cardElement = createCard(
			card,
			deleteCard,
			likeCard,
			openImageModal,
			currentUserId
		)
		placesList.append(cardElement)
	})
}

Promise.all([getUserInfo(), getInitialCards()])
	.then(([userInfo, initialCardsData]) => {
		renderCards(initialCardsData, userInfo._id)
	})
	.catch(error => {
		console.log(error)
	})

enableValidation(editFormSettings)
enableValidation(newPlaceFormSettings)
enableValidation(editAvatarFormSettings)

clearValidation(editForm, editFormSettings)
clearValidation(newPlaceForm, newPlaceFormSettings)
clearValidation(editAvatarForm, editAvatarFormSettings)

export {
	confirmationModal,
	handleConfirmationModal,
	modalNewCard,
	newPlaceForm,
	placesList,
	profileDescription,
	profileName
}
