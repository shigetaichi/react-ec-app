import { signInAction, signOutAction } from './actions';
import { push } from 'connected-react-router';
import { auth, FirebaseTimeStamp, db } from '../../firebase/index';
import {fetchProductsInCartAction,fetchProductsInFavoriteAction, fetchOrdersHistoryAction} from './actions';

export const fetchOrdersHistory = () => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const list = [];

    db.collection('users').doc(uid).collection('orders').orderBy('updated_at', 'desc').get()
      .then( snapshots => {
        snapshots.forEach(snapshot => {
          const data = snapshot.data();
          list.push(data);
        });
        dispatch(fetchOrdersHistoryAction(list));
      });
  }
}

export const fetchProductsInFavorite = (products) => {
  return async (dispatch) => {
    dispatch(fetchProductsInFavoriteAction(products));
  }
}
export const fetchProductsInCart = (products) => {
  return async (dispatch) => {
    dispatch(fetchProductsInCartAction(products));
  }
}

export const addProductToFavorite = (addedProduct) => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;

    const favoriteRef = db.collection('users').doc(uid).collection('favorite').doc();
    addedProduct['favoriteId'] = favoriteRef.id;
    await favoriteRef.set(addedProduct);
    // dispatch(push('/'));
    //ハートをオンオフした時にページ遷移はユーザビリティ的に問題→pushはコメントアウト
  }
}
export const addProductToCart = (addedProduct) => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const cartRef = db.collection('users').doc(uid).collection('cart').doc();
    addedProduct['cartId'] = cartRef.id;
    await cartRef.set(addedProduct);
    dispatch(push('/'));
  }
}

export const resetPassword = (email) => {
  return async (dispatch) => {
    if( email === "" ){
      alert("必須項目が未入力です");
      return false;
    } else {
      auth.sendPasswordResetEmail(email)
      .then( () => {
        alert("入力されたアドレスにパスワードのリセットのためのメールを送信しました。");
        dispatch(push('/'));
      })
      .catch( () => {
        alert("パスワードリセットに失敗しました。");
      })
    }
  }
}

export const listenAuthState = () => {
  return async (dispatch) => {//これがredux-thunkを使う基本形
    return auth.onAuthStateChanged( user => {
      if (user){
        const uid = user.uid;
        db.collection('users').doc(uid).get()
        .then(snapshot => {
          const data = snapshot.data();

          dispatch(signInAction( {
            isSignedIn: true,
            role: data.role,
            uid: uid,
            username: data.username,
          } ));
        });
      } else {
        dispatch(push('/signin'))
      }
    })
  }
}

export const signIn = (email, password) => {
  return async ( dispatch ) => {
    //Validation
    if( email === "" || password === "" ){
      alert('必須項目が未入力です');
      return false;
    }
    return auth.signInWithEmailAndPassword(email, password)
    .then( result => {
      const user = result.user;

      if(user){
        const uid = user.uid;
        db.collection('users').doc(uid).get()
        .then(snapshot => {
          console.log(snapshot);
          const data = snapshot.data();

          dispatch(signInAction( {
            isSignedIn: true,
            role: data.role,
            uid: uid,
            username: data.username,
          } ));
          dispatch(push('/'));
        });
      }
    })
  }
}

export const signUp = (username, email, password, confirmPassword) => {
  return async (dispatch) => {
    //Validation
    if(username === "" || email === "" || password === "" || confirmPassword === ""){
      alert('必須項目が未入力です');
      return false;
    }

    if(password !== confirmPassword){
      alert('パスワードが一致していません。もう一度入力してください。');
    }

    return auth.createUserWithEmailAndPassword(email, password)
          .then(result => {
            const user = result.user;

            if(user){
              const uid = user.uid;
              const timestamp = FirebaseTimeStamp.now();

              const userInitialData = {
                created_at: timestamp,
                email: email,
                uid: uid,
                password: password,
                role: "customer",
                updated_at: timestamp,
                username: username,
              }

              db.collection('users').doc(uid).set(userInitialData)
              .then( () => {
                dispatch(push('/'))
              })
            }
          })
  }
}


export const signOut = () => {
  return async (dispatch) => {
    //firebaseのauthentication的なサインアウトを実行してから、reduxのstoreの状態も変更する。
    auth.signOut()
    .then( () => {
      dispatch(signOutAction());
      dispatch(push('/signin'));
    } )
  }
}