function createCard(card, deleteCard) {
  const cardTemplate = document.querySelector('#card-template').content
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true)
  const cardImage = cardElement.querySelector('.card__image')
  const cardTitle = cardElement.querySelector('.card__title')
  const deleteButton = cardElement.querySelector('.card__delete-button')

  deleteButton.addEventListener('click', () => deleteCard(cardElement))

  cardImage.src = card.link
  cardImage.alt = card.name
  cardTitle.textContent = card.name

  return cardElement
}

function renderCards(cards) {
  const placesList = document.querySelector('.places__list')

  cards.forEach(card => {
    const cardElement = createCard(card, deleteCard)
    placesList.append(cardElement)
  })
}

const deleteCard = cardElement => cardElement.remove()

renderCards(initialCards)
