import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getIsSignedIn } from './redux/users/selectors';
import { listenAuthState } from './redux/users/operations';

const Auth = ({children}) => {
  const dispatch = useDispatch();
  const selector = useSelector( (state) => state);
  const isSignedIn = getIsSignedIn(selector);

  useEffect( () => {
    if(!isSignedIn){
      dispatch(listenAuthState())
    }
  }, [isSignedIn, dispatch]);

  if(!isSignedIn){
    return <></>;
  } else {
    return children;
  }
}

export default Auth;