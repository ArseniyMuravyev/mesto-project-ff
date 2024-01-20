import '../pages/index.css'
import {
	deleteCard,
	getInitialCards,
	getUserInfo,
	postNewCard,
	updateAvatar,
	updateUserProfile
} from './api'
import { Card, createCard, handleDeleteCardClick, handleLikeCard } from './card'
import { closeModal, openModal } from './modal'
import { catchError } from './utils'
import { clearValidation, enableValidation } from './validation'

interface UserInfoType {
	_id: string
	name: string
	about: string
	avatar: string
}

const editAvatarForm: HTMLFormElement = document.forms.namedItem('edit_avatar')
const editProfileForm: HTMLFormElement =
	document.forms.namedItem('edit_profile')
const newPlaceForm: HTMLFormElement = document.forms.namedItem('new_place')
const modalEditAvatar: HTMLDivElement =
	document.querySelector('.popup_type_avatar')
const modalEditProfile: HTMLDivElement =
	document.querySelector('.popup_type_edit')
const modalImage: HTMLDivElement = document.querySelector('.popup_type_image')
const modalNewCard: HTMLDivElement = document.querySelector(
	'.popup_type_new-card'
)
const modalDeleteConfirmation: HTMLDivElement = document.querySelector(
	'.popup_type_delete_card'
)
const editButton: HTMLButtonElement = document.querySelector(
	'.profile__edit-button'
)
const addButton: HTMLButtonElement = document.querySelector(
	'.profile__add-button'
)
const deleteButtonSubmit: HTMLButtonElement =
	modalDeleteConfirmation.querySelector('.popup__button-delete')
const nameInput: HTMLInputElement = editProfileForm.querySelector(
	'.popup__input_type_name'
)
const jobInput: HTMLInputElement = editProfileForm.querySelector(
	'.popup__input_type_description'
)
const avatarInput: HTMLInputElement = document.querySelector(
	'.popup__input_type_avatar_url'
)
const profileName: HTMLTitleElement = document.querySelector('.profile__title')
const profileDescription: HTMLParagraphElement = document.querySelector(
	'.profile__description'
)
const profileImage: HTMLImageElement = document.querySelector('.profile__image')
const placesList: HTMLUListElement = document.querySelector('.places__list')
const cardNameInput: HTMLInputElement = document.querySelector(
	'.popup__input_type_card-name'
)
const imageUrlInput: HTMLInputElement = document.querySelector(
	'.popup__input_type_url'
)
const popupImage: HTMLImageElement = modalImage.querySelector('.popup__image')
const popupCaption: HTMLParagraphElement =
	modalImage.querySelector('.popup__caption')
const profileAvatar: HTMLDivElement = document.querySelector('.profile__image')
let userId: string
let submitFormConfirm = (): void => {}

profileImage.addEventListener('click', () => {
	openModal(modalEditAvatar)
	clearValidation(editAvatarForm, formSettings)
})

editButton.addEventListener('click', () => {
	openModal(modalEditProfile)
	clearValidation(editProfileForm, formSettings)
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

const handleFormSubmit = (evt: MouseEvent) => {
	evt.preventDefault()
	renderLoading(true)
	updateUserProfile(nameInput.value, jobInput.value)
		.then((data: { name: string; about: string }) => {
			profileName.textContent = data.name
			profileDescription.textContent = data.about
		})
		.then(() => closeModal(modalEditProfile))
		.catch(catchError)
		.finally(() => renderLoading(false))
}

const handleAvatarFormSubmit = (evt: MouseEvent) => {
	evt.preventDefault()
	renderLoading(true)
	updateAvatar(avatarInput.value)
		.then((data: { avatar: string }) => {
			profileAvatar.style.backgroundImage = `url(${data.avatar})`
		})
		.then(() => closeModal(modalEditAvatar))
		.catch(catchError)
		.finally(() => renderLoading(false))
}

const handleDeleteCard = (cardElement: HTMLLIElement, cardId: string) => {
	submitFormConfirm = () => {
		deleteButtonSubmit.textContent = 'Удаление...'
		deleteCard(cardId)
			.then(() => {
				handleDeleteCardClick(cardElement)
				closeModal(modalDeleteConfirmation)
			})
			.catch(catchError)
			.finally(() => {
				deleteButtonSubmit.textContent = 'Да'
			})
	}
	openModal(modalDeleteConfirmation)
}

const openImageModal = (evt: MouseEvent) => {
	if (
		evt.target instanceof HTMLImageElement &&
		evt.target.classList.contains('card__image')
	) {
		const cardElement: HTMLLIElement = evt.target.closest('.places__item')
		const cardTitle: string =
			cardElement.querySelector('.card__title').textContent

		popupImage.src = evt.target.getAttribute('src')
		popupImage.alt = cardTitle
		popupCaption.textContent = cardTitle

		openModal(modalImage)
	}
}

const createNewPlace = (evt: MouseEvent) => {
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
			) as HTMLLIElement

			placesList.prepend(cardElement)
		})
		.then(() => newPlaceForm.reset())
		.then(() => closeModal(modalNewCard))
		.catch(catchError)
		.finally(() => renderLoading(false))
}

editAvatarForm.addEventListener('submit', handleAvatarFormSubmit)
editProfileForm.addEventListener('submit', handleFormSubmit)
newPlaceForm.addEventListener('submit', createNewPlace)
modalDeleteConfirmation.addEventListener('submit', (evt: MouseEvent) => {
	evt.preventDefault()
	submitFormConfirm()
})

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
		) as HTMLLIElement
		placesList.append(cardElement)
	})
}

const renderLoading = (isLoading: boolean) => {
	const submitButton: NodeListOf<HTMLButtonElement> =
		document.querySelectorAll('.popup__button')
	submitButton.forEach(
		(button: HTMLButtonElement) =>
			(button.textContent = isLoading ? 'Сохранение...' : 'Сохранить')
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
	modalDeleteConfirmation,
	modalNewCard,
	newPlaceForm,
	placesList,
	profileDescription,
	profileName
}
