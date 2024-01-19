const modals: NodeListOf<HTMLElement> = document.querySelectorAll('.popup')
let isEscListenerAdded: boolean = false

export const openModal = (modal: HTMLElement) => {
	modal.classList.add('popup__opened')
	addEscListener()
}

export const closeModal = (modal: HTMLElement | null) => {
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

const closeModalOnEsc = (evt: KeyboardEvent) => {
	if (evt.key === 'Escape') {
		const openedModal: HTMLElement = document.querySelector('.popup__opened')
		closeModal(openedModal)
	}
}

modals.forEach(modal => {
	modal.addEventListener('click', evt => {
		if (
			evt.target === modal ||
			(evt.target as HTMLElement).classList.contains('popup__close')
		) {
			closeModal(modal)
		}
	})
})
