import { ValidationSettings } from '../types/global.d'

const showInputError = (
	formElement: HTMLElement,
	inputElement: HTMLInputElement,
	errorMessage: string,
	settings: ValidationSettings
) => {
	const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
	if (errorElement) {
		inputElement.classList.add(settings.inputErrorClass)
		errorElement.textContent = errorMessage
		errorElement.classList.add(settings.errorClass)
	}
}

const hideInputError = (
	formElement: HTMLElement,
	inputElement: HTMLInputElement,
	settings: ValidationSettings
) => {
	const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
	if (errorElement) {
		inputElement.classList.remove(settings.inputErrorClass)
		errorElement.classList.remove(settings.errorClass)
		errorElement.textContent = ''
	}
}

const checkInputValidity = (
	formElement: HTMLElement,
	inputElement: HTMLInputElement,
	settings: ValidationSettings
) => {
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

const hasInvalidInput = (inputList: HTMLInputElement[]) => {
	return inputList.some(inputElement => {
		return !inputElement.validity.valid
	})
}

const toggleButtonState = (
	inputList: HTMLInputElement[],
	buttonElement: HTMLButtonElement,
	settings: ValidationSettings
) => {
	if (hasInvalidInput(inputList)) {
		buttonElement.setAttribute('disabled', 'true')
		buttonElement.classList.add(settings.inactiveButtonClass)
	} else {
		buttonElement.removeAttribute('disabled')
		buttonElement.classList.remove(settings.inactiveButtonClass)
	}
}

const setEventListeners = (
	formElement: HTMLElement,
	settings: ValidationSettings
) => {
	const inputList = Array.from(
		formElement.querySelectorAll(settings.inputSelector)
	) as HTMLInputElement[]
	const buttonElement = formElement.querySelector(
		settings.submitButtonSelector
	) as HTMLButtonElement

	toggleButtonState(inputList, buttonElement, settings)

	inputList.forEach((inputElement: HTMLInputElement) => {
		inputElement.addEventListener('input', () => {
			checkInputValidity(formElement, inputElement, settings)
			toggleButtonState(inputList, buttonElement, settings)
		})
	})
}

const enableValidation = (settings: ValidationSettings) => {
	const formList = Array.from(document.querySelectorAll(settings.formSelector))
	formList.forEach((formElement: HTMLElement) => {
		formElement.addEventListener('submit', evt => {
			evt.preventDefault()
		})
		setEventListeners(formElement, settings)
	})
}

const clearValidation = (
	formElement: HTMLElement,
	settings: ValidationSettings
) => {
	const inputList = Array.from(
		formElement.querySelectorAll(settings.inputSelector)
	) as HTMLInputElement[]
	inputList.forEach((inputElement: HTMLInputElement) => {
		hideInputError(formElement, inputElement, settings)
	})

	const buttonElement = formElement.querySelector(
		settings.submitButtonSelector
	) as HTMLButtonElement
	toggleButtonState(inputList, buttonElement, settings)
}

export { clearValidation, enableValidation }
