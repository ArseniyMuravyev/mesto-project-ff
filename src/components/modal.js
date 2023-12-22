const modals = document.querySelectorAll('.popup')
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
	const openedModal = document.querySelector('.popup__opened')
	if (openedModal && evt.key === 'Escape') {
		closeModal(openedModal)
		removeEscListener()
	}
}

function openImageModal(evt) {
	if (evt.target.classList.contains('card__image')) {
		const modalImage = document.querySelector('.popup_type_image')
		const cardElement = evt.target.closest('.places__item')
		const cardTitle = cardElement.querySelector('.card__title').textContent
		const cardImageLink = evt.target.getAttribute('src')
		const popupImage = modalImage.querySelector('.popup__image')
		const popupCaption = modalImage.querySelector('.popup__caption')

		popupImage.src = cardImageLink
		popupImage.alt = cardTitle
		popupCaption.textContent = cardTitle

		openModal(modalImage)
	}
}

modals.forEach(modal => {
	modal.addEventListener('click', evt => {
		if (evt.target === modal) {
			closeModal(modal)
		}
	})
})

document.addEventListener('keydown', closeModalOnEsc)

export { closeModal, openImageModal, openModal }
