const modals = document.querySelectorAll('.popup')
let isEscListenerAdded = false

export const openModal = modal => {
	modal.classList.add('popup__opened')
	addEscListener()
}

export const closeModal = modal => {
	if (modal) {
		modal.classList.remove('popup__opened')
		removeEscListener()
	}
}

const addEscListener = () => {
	if (!isEscListenerAdded) {
		document.addEventListener('keydown', closeModalOnEsc)
		isEscListenerAdded = true
	}
}

const removeEscListener = () => {
	document.removeEventListener('keydown', closeModalOnEsc)
	isEscListenerAdded = false
}

const closeModalOnEsc = evt => {
	if (evt.key === 'Escape') {
		const openedModal = document.querySelector('.popup__opened')
		closeModal(openedModal)
	}
}

modals.forEach(modal => {
	modal.addEventListener('click', evt => {
		if (evt.target === modal || evt.target.classList.contains('popup__close')) {
			closeModal(modal)
		}
	})
})
