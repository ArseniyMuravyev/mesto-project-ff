const modals: NodeListOf<HTMLDivElement> = document.querySelectorAll('.popup')
let isEscListenerAdded: boolean = false

export const openModal = (modal: HTMLDivElement) => {
	modal.classList.add('popup__opened')
	addEscListener()
}

export const closeModal = (modal: HTMLDivElement | null) => {
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
		const openedModal: HTMLDivElement = document.querySelector('.popup__opened')
		closeModal(openedModal)
	}
}

modals.forEach(modal => {
	modal.addEventListener('click', evt => {
		if (
			evt.target === modal ||
			(evt.target as HTMLDivElement).classList.contains('popup__close')
		) {
			closeModal(modal)
		}
	})
})
