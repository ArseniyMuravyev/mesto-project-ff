const showInputError = (
	formElement,
	inputElement,
	errorMessage,
	{ inputErrorClass, errorClass }
) => {
	const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
	if (errorElement) {
		inputElement.classList.add(inputErrorClass)
		errorElement.textContent = errorMessage
		errorElement.classList.add(errorClass)
	}
}

const hideInputError = (
	formElement,
	inputElement,
	{ inputErrorClass, errorClass }
) => {
	const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
	if (errorElement) {
		inputElement.classList.remove(inputErrorClass)
		errorElement.classList.remove(errorClass)
		errorElement.textContent = ''
	}
}

const checkInputValidity = (formElement, inputElement, settings) => {
	if (!inputElement.validity.valid) {
		showInputError(
			formElement,
			inputElement,
			inputElement.validationMessage,
			settings
		)
		if (inputElement.value.trim() === '') {
			showInputError(
				formElement,
				inputElement,
				inputElement.dataset.error,
				settings
			)
		} else if (inputElement.validity.typeMismatch) {
			showInputError(
				formElement,
				inputElement,
				inputElement.dataset.url,
				settings
			)
		}
	} else {
		hideInputError(formElement, inputElement, settings)
	}
}

const hasInvalidInput = inputList => {
	return inputList.some(inputElement => {
		return !inputElement.validity.valid
	})
}

const toggleButtonState = (
	inputList,
	buttonElement,
	{ inactiveButtonClass }
) => {
	if (hasInvalidInput(inputList)) {
		buttonElement.classList.add(inactiveButtonClass)
	} else {
		buttonElement.classList.remove(inactiveButtonClass)
	}
}

const setEventListeners = (formElement, settings) => {
	const inputList = Array.from(
		formElement.querySelectorAll(settings.inputSelector)
	)
	const buttonElement = formElement.querySelector(settings.submitButtonSelector)

	toggleButtonState(inputList, buttonElement, settings)

	inputList.forEach(inputElement => {
		inputElement.addEventListener('input', () => {
			checkInputValidity(formElement, inputElement, settings)
			toggleButtonState(inputList, buttonElement, settings)
		})
	})
}

const enableValidation = settings => {
	const formList = Array.from(document.querySelectorAll(settings.formSelector))
	formList.forEach(formElement => {
		formElement.addEventListener('submit', evt => {
			evt.preventDefault()
		})
		setEventListeners(formElement, settings)
	})
}

const clearValidation = (formElement, settings) => {
	const inputList = Array.from(
		formElement.querySelectorAll(settings.inputSelector)
	)
	inputList.forEach(inputElement => {
		hideInputError(formElement, inputElement, settings)
	})

	const buttonElement = formElement.querySelector(settings.submitButtonSelector)
	toggleButtonState(inputList, buttonElement, settings)
}

export { clearValidation, enableValidation }
