const cardsById = (state = {}, action) => {
  switch (action.type) {
    case "ADD_CARD": {
      const { cardText, cardId, listTitle } = action.payload;
      return { ...state, [cardId]: { title: cardText, _id: cardId, text: "", priority: listTitle} };
    }
    case "CHANGE_CARD_TEXT": {
      const { cardText, cardId, cardTitle } = action.payload;
      return { ...state, [cardId]: { ...state[cardId], text: cardText, title: cardTitle } };
    }
    case "MOVE_CARD": {
      const { cardId, listTitle } = action.payload;
      return {...state, [cardId]: {...state[cardId], priority: listTitle}};
    }
    case "CHANGE_CARD_DATE": {
      const { date, cardId } = action.payload;
      return { ...state, [cardId]: { ...state[cardId], date } };
    }
    case "CHANGE_CARD_COLOR": {
      const { color, cardId } = action.payload;
      return { ...state, [cardId]: { ...state[cardId], color } };
    }
    case "DELETE_CARD": {
      const { cardId } = action.payload;
      const { [cardId]: deletedCard, ...restOfCards } = state;
      return restOfCards;
    }
    // Find every card from the deleted list and remove it (actually unnecessary since they will be removed from db on next write anyway)
    case "DELETE_LIST": {
      const { cards: cardIds } = action.payload;
      return Object.keys(state)
        .filter(cardId => !cardIds.includes(cardId))
        .reduce(
          (newState, cardId) => ({ ...newState, [cardId]: state[cardId] }),
          {}
        );
    }
    default:
      return state;
  }
};

export default cardsById;
