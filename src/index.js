import {
	deleteCard,
	getInitialCards,
	getUserInfo,
	postNewCard,
	updateAvatar,
	updateUserProfile
} from './components/api'
import { createCard, handleDeleteCard, handleLikeCard } from './components/card'
import { closeModal, openModal } from './components/modal'
import { catchError } from './components/utils.js'
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
const cardNameInput = document.querySelector('.popup__input_type_card-name')
const imageUrlInput = document.querySelector('.popup__input_type_url')
const modalImage = document.querySelector('.popup_type_image')
const popupImage = modalImage.querySelector('.popup__image')
const popupCaption = modalImage.querySelector('.popup__caption')
const profileAvatar = document.querySelector('.profile__image')
let userId

profileImage.addEventListener('click', () => {
	openModal(editAvatarForm)
	clearValidation(editAvatarForm, formSettings)
})

editButton.addEventListener('click', () => {
	openModal(modalEdit)
	clearValidation(editForm, formSettings)
	setFormValues()
})

addButton.addEventListener('click', () => {
	openModal(modalNewCard)
	clearValidation(newPlaceForm, formSettings)
})

const setFormValues = () => {
	nameInput.value = profileName.textContent
	jobInput.value = profileDescription.textContent
}

const handleFormSubmit = evt => {
	evt.preventDefault()
	renderLoading(true)
	updateUserProfile(nameInput.value, jobInput.value)
		.then(data => {
			profileName.textContent = data.name
			profileDescription.textContent = data.about
		})
		.then(() => closeModal(modalEdit))
		.catch(catchError)
		.finally(() => renderLoading(false))
}

const handleAvatarFormSubmit = evt => {
	evt.preventDefault()
	renderLoading(true)
	updateAvatar(avatarInput.value)
		.then(data => {
			profileAvatar.style.backgroundImage = `url(${data.avatar})`
		})
		.then(() => closeModal(editAvatarForm))
		.catch(catchError)
		.finally(() => renderLoading(false))
}

const handleConfirmationModal = (evt, cardElement, cardId) => {
	evt.preventDefault()
	deleteCard(cardElement, cardId)
		.then(() => closeModal(confirmationModal))
		.catch(catchError)
}

const openImageModal = evt => {
	if (evt.target.classList.contains('card__image')) {
		const cardElement = evt.target.closest('.places__item')
		const cardTitle = cardElement.querySelector('.card__title').textContent

		popupImage.src = evt.target.getAttribute('src')
		popupImage.alt = cardTitle
		popupCaption.textContent = cardTitle

		openModal(modalImage)
	}
}

const createNewPlace = evt => {
	evt.preventDefault()
	renderLoading(true)
	postNewCard(cardNameInput.value, imageUrlInput.value)
		.then(newCard => {
			const cardElement = createCard(
				newCard,
				handleDeleteCard,
				handleLikeCard,
				openImageModal,
				userId
			)

			placesList.prepend(cardElement)
		})
		.then(() => newPlaceForm.reset())
		.then(() => closeModal(modalNewCard))
		.catch(catchError)
		.finally(() => renderLoading(false))
}

editAvatarForm.addEventListener('submit', handleAvatarFormSubmit)
editForm.addEventListener('submit', handleFormSubmit)
newPlaceForm.addEventListener('submit', createNewPlace)

const formSettings = {
	formSelector: '.popup__form',
	inputSelector: '.popup__input',
	submitButtonSelector: '.popup__button',
	inactiveButtonClass: 'popup__button_disabled',
	inputErrorClass: 'popup__input_type_error',
	errorClass: 'popup__error_visible'
}

const renderCards = (cards, currentUserId) => {
	cards.forEach(card => {
		const cardElement = createCard(
			card,
			handleDeleteCard,
			handleLikeCard,
			openImageModal,
			currentUserId
		)
		placesList.append(cardElement)
	})
}

const renderLoading = isLoading => {
	const submitButton = document.querySelectorAll('.popup__button')
	submitButton.forEach(
		button => (button.textContent = isLoading ? 'Сохранение...' : 'Сохранить')
	)
}

Promise.all([getUserInfo(), getInitialCards()])
	.then(([userData, cards]) => {
		userId = userData._id
		profileName.textContent = userData.name
		profileDescription.textContent = userData.about
		profileAvatar.style.backgroundImage = `url(${userData.avatar})`

		renderCards(cards, userId)
	})
	.catch(catchError)

enableValidation(formSettings)

export {
	confirmationModal,
	handleConfirmationModal,
	modalNewCard,
	newPlaceForm,
	placesList,
	profileDescription,
	profileName
}
