import '../pages/index.css'
import { Card, UserInfoType } from '../types/global.d'
import {
	deleteCard,
	getInitialCards,
	getUserInfo,
	postNewCard,
	updateAvatar,
	updateUserProfile
} from './api'
import { createCard, handleDeleteCard, handleLikeCard } from './card'
import { closeModal, openModal } from './modal'
import { catchError } from './utils'
import { clearValidation, enableValidation } from './validation'

const editForm = document.forms.namedItem('edit_profile') as HTMLFormElement
const newPlaceForm: HTMLFormElement = document.forms.namedItem(
	'new_place'
) as HTMLFormElement
const editAvatarForm = document.querySelector(
	'.popup_type_avatar'
) as HTMLFormElement
const editButton: HTMLButtonElement = document.querySelector(
	'.profile__edit-button'
)
const addButton: HTMLButtonElement = document.querySelector(
	'.profile__add-button'
)
const modalEdit: HTMLElement = document.querySelector('.popup_type_edit')
const nameInput: HTMLInputElement = editForm.querySelector(
	'.popup__input_type_name'
)
const jobInput: HTMLInputElement = editForm.querySelector(
	'.popup__input_type_description'
)
const avatarInput: HTMLInputElement = document.querySelector(
	'.popup__input_type_avatar_url'
)
const profileName: HTMLElement = document.querySelector('.profile__title')
const profileDescription: HTMLElement = document.querySelector(
	'.profile__description'
)
const placesList: HTMLElement = document.querySelector('.places__list')
const modalNewCard: HTMLElement = document.querySelector('.popup_type_new-card')
const profileImage: HTMLImageElement = document.querySelector('.profile__image')
const confirmationModal: HTMLElement = document.querySelector(
	'.popup_type_delete_card'
)
const cardNameInput: HTMLInputElement = document.querySelector(
	'.popup__input_type_card-name'
)
const imageUrlInput: HTMLInputElement = document.querySelector(
	'.popup__input_type_url'
)
const modalImage: HTMLImageElement = document.querySelector('.popup_type_image')
const popupImage: HTMLImageElement = modalImage.querySelector('.popup__image')
const popupCaption: HTMLElement = modalImage.querySelector('.popup__caption')
const profileAvatar: HTMLElement = document.querySelector('.profile__image')
const deleteButtonSubmit: HTMLButtonElement = confirmationModal.querySelector(
	'.popup__button-delete'
)
let userId: string

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

const handleFormSubmit = (evt: Event) => {
	evt.preventDefault()
	renderLoading(true)
	updateUserProfile(nameInput.value, jobInput.value)
		.then((data: { name: string; about: string }) => {
			profileName.textContent = data.name
			profileDescription.textContent = data.about
		})
		.then(() => closeModal(modalEdit))
		.catch(catchError)
		.finally(() => renderLoading(false))
}

const handleAvatarFormSubmit = (evt: Event) => {
	evt.preventDefault()
	renderLoading(true)
	updateAvatar(avatarInput.value)
		.then((data: { avatar: string }) => {
			profileAvatar.style.backgroundImage = `url(${data.avatar})`
		})
		.then(() => closeModal(editAvatarForm))
		.catch(catchError)
		.finally(() => renderLoading(false))
}

const handleConfirmationModal = (
	evt: Event,
	cardElement: HTMLElement,
	cardId: string
) => {
	evt.preventDefault()
	deleteButtonSubmit.textContent = 'Удаление...'
	deleteCard(cardElement, cardId)
		.then(() => closeModal(confirmationModal))
		.catch(catchError)
}

const openImageModal = (evt: Event) => {
	if (
		evt.target instanceof HTMLImageElement &&
		evt.target.classList.contains('card__image')
	) {
		const cardElement = evt.target.closest('.places__item')
		const cardTitle = cardElement.querySelector('.card__title').textContent

		popupImage.src = evt.target.getAttribute('src')
		popupImage.alt = cardTitle
		popupCaption.textContent = cardTitle

		openModal(modalImage)
	}
}

const createNewPlace = (evt: Event) => {
	evt.preventDefault()
	renderLoading(true)
	postNewCard(cardNameInput.value, imageUrlInput.value)
		.then((newCard: Card) => {
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

const renderCards = (cards: Card[], currentUserId: string) => {
	cards.forEach((card: Card) => {
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

const renderLoading = (isLoading: boolean) => {
	const submitButton = document.querySelectorAll('.popup__button')
	submitButton.forEach(
		button => (button.textContent = isLoading ? 'Сохранение...' : 'Сохранить')
	)
}

Promise.all([getUserInfo(), getInitialCards()])
	.then(([userData, cards]: [UserInfoType, Card[]]) => {
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
