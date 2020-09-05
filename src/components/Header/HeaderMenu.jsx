import React, {useEffect} from 'react';
import IconButton from "@material-ui/core/IconButton";
import {Badge} from "@material-ui/core";
import {fetchProductsInCart} from "../../redux/users/operations";
import {useDispatch, useSelector} from "react-redux";
import {getProductsInCart, getUserId} from "../../redux/users/selectors";
import {push} from "connected-react-router"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import {db} from '../../firebase/index'
import MenuIcon from "@material-ui/icons/Menu";

const HeaderMenu = (props) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const uid = getUserId(selector);
  let productsInCart = getProductsInCart(selector);

  useEffect( () => {
    const unsubscribe = db.collection('users').doc(uid).collection('cart')
                        .onSnapshot(snapshot => {
                          console.log(snapshot.docChanges());
                          
                          snapshot.docChanges().forEach(change => {
                            console.log(change.doc.data());
                            
                            const product = change.doc.data();
                            const changeType = change.type;

                            switch(changeType){
                              case "added":
                                productsInCart.push(product);
                                break;
                              case "modified":
                                const index = productsInCart.findIndex(product => product.cartId === change.doc.id);
                                productsInCart[index] = product;
                                break;
                              case "removed":
                                productsInCart = productsInCart.filter(product => product.cartId !== change.doc.id);
                                break;
                              default:
                                break;
                            }
                          });
                          dispatch(fetchProductsInCart(productsInCart));
                        });
                        return () => unsubscribe();
  },[]);

  return (
    <>
      <IconButton onClick={() => dispatch(push('/cart'))}>
      {console.log(productsInCart)}
        <Badge badgeContent={productsInCart.length === 0 ? null : productsInCart.length} color="secondary" >
          {console.log(productsInCart.length)}
          <ShoppingCartIcon/>
        </Badge>
      </IconButton>
      <IconButton onClick={() => dispatch(push('/favorite'))} >
        <FavoriteBorderIcon/>
      </IconButton>
      <IconButton onClick={(event) => props.handleDrawerToggle(event)} >
        <MenuIcon/>
      </IconButton>
    </>
  )
}

export default HeaderMenu