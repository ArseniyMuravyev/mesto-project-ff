export interface UserInfoType {
  _id: string;
  name: string;
  about: string;
  avatar: string;
}

export interface ValidationSettings {
	formSelector: string
	inputSelector: string
	submitButtonSelector: string
	inactiveButtonClass: string
	inputErrorClass: string
	errorClass: string
}

export interface Card {
	owner?: {
		_id: string
	}
	likes?: {
		_id: string
	}[]
	_id: string
	link: string
	name: string
}

export interface Likes {
	name: string
	about: string
	avatar: string
	_id: string
	cohort: string
}

export interface Config {
	baseUrl: string
	headers: {
		authorization: string
		'Content-Type': string
	}
}