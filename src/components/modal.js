const modals = document.querySelectorAll('.popup')
const modalImage = document.querySelector('.popup_type_image')
const popupImage = modalImage.querySelector('.popup__image')
const popupCaption = modalImage.querySelector('.popup__caption')
let isEscListenerAdded = false

const openModal = modal => {
	modal.classList.add('popup__opened')
	addEscListener()
}

const closeModal = modal => {
	if (modal) {
		modal.classList.remove('popup__opened')
		removeEscListener()
	}
}

function addEscListener() {
	if (!isEscListenerAdded) {
		document.addEventListener('keydown', closeModalOnEsc)
		isEscListenerAdded = true
	}
}

function removeEscListener() {
	document.removeEventListener('keydown', closeModalOnEsc)
	isEscListenerAdded = false
}

function closeModalOnEsc(evt) {
	if (evt.key === 'Escape') {
		const openedModal = document.querySelector('.popup__opened')
		closeModal(openedModal)
	}
}

function openImageModal(evt) {
	if (evt.target.classList.contains('card__image')) {
		const cardElement = evt.target.closest('.places__item')
		const cardTitle = cardElement.querySelector('.card__title').textContent
		const cardImageLink = evt.target.getAttribute('src')

		popupImage.src = cardImageLink
		popupImage.alt = cardTitle
		popupCaption.textContent = cardTitle

		openModal(modalImage)
	}
}

modals.forEach(modal => {
	modal.addEventListener('click', evt => {
		if (evt.target === modal || evt.target.classList.contains('popup__close')) {
			closeModal(modal)
		}
	})
})

export { closeModal, openImageModal, openModal }
