import * as Actions from './actions';
import initialState from '../store/initialState';

//一行目stateがなかったら、initialState.usersを代入する。
//一行目actionは、actions.jsのactions返り値
export const ProductsReducer = (state = initialState.products, action) => {
  switch(action.type){
    case Actions.FETCH_PRODUCTS:
      return {
        ...state,
        list: [...action.payload],//スプレッド構文で配列を展開し、さらに[]で囲って配列にするという書き方。Reduxのstoreのメモリー情報というのが書き換わる。こうしないと、storeの書き変わりが感知されないよ！
      }
    case Actions.DELETE_PRODUCT:
      return {
        ...state,
        list: [...action.payload],
      }
    default: 
      return state;
  }
}