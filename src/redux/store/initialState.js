//アプリに必要なstateを全て記述
const initialState = {
  products: {
    list: []
  },
  users: {
    cart: [],
    favorite: [],
    orders: [],
    isSignedIn: false,
    uid: "",
    role: "",
    username: "",
  }
};

export default initialState;