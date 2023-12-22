import {
	createCard,
	createNewPlace,
	deleteCard,
	likeCard
} from './components/card'
import { initialCards } from './components/cards'
import { closeModal, openImageModal, openModal } from './components/modal'
import './pages/index.css'

const editButton = document.querySelector('.profile__edit-button')
const addButton = document.querySelector('.profile__add-button')
const modalEdit = document.querySelector('.popup_type_edit')
const modalCloseButtons = document.querySelectorAll('.popup__close')
const editForm = document.forms.edit_profile
const nameInput = editForm.querySelector('.popup__input_type_name')
const jobInput = editForm.querySelector('.popup__input_type_description')
const profileName = document.querySelector('.profile__title')
const profileDescription = document.querySelector('.profile__description')
const placesList = document.querySelector('.places__list')
const newPlaceForm = document.forms.new_place
const modalNewCard = document.querySelector('.popup_type_new-card')

editButton.addEventListener('click', () => {
	openModal(modalEdit)
	setFormValues()
})

addButton.addEventListener('click', () => openModal(modalNewCard))

modalCloseButtons.forEach(button => {
	button.addEventListener('click', evt => {
		const modal = evt.target.closest('.popup')
		closeModal(modal)
	})
})

function setFormValues() {
	const currentName = profileName.textContent
	const currentDescription = profileDescription.textContent

	nameInput.value = currentName
	jobInput.value = currentDescription
}

function handleFormSubmit(evt) {
	evt.preventDefault()

	const newName = nameInput.value
	const newDescription = jobInput.value

	profileName.textContent = newName
	profileDescription.textContent = newDescription

	closeModal(modalEdit)
}

editForm.addEventListener('submit', handleFormSubmit)
newPlaceForm.addEventListener('submit', createNewPlace)
placesList.addEventListener('click', openImageModal)

function renderCards(cards) {
	cards.forEach(card => {
		const cardElement = createCard(card, deleteCard, likeCard)
		placesList.append(cardElement)
	})
}

renderCards(initialCards)

export { modalNewCard, newPlaceForm, placesList }
