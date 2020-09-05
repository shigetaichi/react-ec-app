import * as Actions from './actions';
import initialState from '../store/initialState';

//一行目stateがなかったら、initialState.usersを代入する。
//一行目actionは、actions.jsのactions返り値
export const UsersReducer = (state = initialState.users, action) => {
  switch(action.type){
    case Actions.FETCH_ORDERS_HISTORY:
      return {
        ...state,
        orders: [...action.payload]//この書き方をすることでreduxが配列生成を検知してコンポーネントがわで値を受け取れる。
      }
    case Actions.FETCH_PRODUCTS_IN_FAVORITE:
      return {
        ...state,
        favorite: [...action.payload]
      }
    case Actions.FETCH_PRODUCTS_IN_CART:
      return {
        ...state,
        cart: [...action.payload]
      }
    case Actions.SIGN_IN:
      return {
        ...state,
        ...action.payload
        //スプレッド構文二つかさねて{}で囲んで書くことでマージできる。一つのオブジェクトにできる。
        // isSignedIn: action.payload.isSignedIn,
        // uid: action.payload.uid,
        // username: action.payload.username
        //スプレッド構文なかったら上記のようになる

        //二つ並んで書いてたら、キーが重なるクネ？となるが、後に書かれているキーの状態を読み込むから問題ない。
        //action.payloadに存在していないkeyもstateがあれば補填できる。（完全に上書きされてkeyが消えてしまうことを防ぐのです。）
      }
    case Actions.SIGN_OUT:
      return {
        ...action.payload
      }
    default: 
      return state;
  }
}