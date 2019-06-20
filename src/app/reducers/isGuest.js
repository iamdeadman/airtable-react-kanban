const isGuest = (state = true, action) => {
  switch (action.type) {
    case "ENTER_AS_GUEST": {
      return true;
    }
    default:
      return state;
  }
};

export default isGuest;
