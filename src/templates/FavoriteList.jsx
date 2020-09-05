import React from 'react'
import {useDispatch, useSelector} from 'react-redux';
import { List } from '@material-ui/core'
import { getProductsInFavorite } from '../redux/users/selectors';
import {FavoriteListItem} from '../components/Products/index';
import {GreyButton} from '../components/UIkit/index'
// import { useCallback } from 'react';
import {push} from 'connected-react-router';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root:{
    margin: '0 auto',
    maxWidth: 512,
    width: '100%',
  }
})

const FavoriteList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const productsInFavorite = getProductsInFavorite(selector);

  const backToHome = () => {
    dispatch(push('/'))
  }
  console.log(selector);
  console.log(productsInFavorite);
  
  return (
    <section className="c-section-wrapin">
      <h2 className="u-text__headline">
        お気に入り一覧
      </h2>
      <List className={classes.root}>
        {productsInFavorite.length > 0 && (
          productsInFavorite.map( (product) => <FavoriteListItem key={product.favoriteId} product={product} />)
        )}
      </List>
      <div className="module-spacer--medium"></div>
      <div className="p-grid__column">
        <div className="module-spacer--extra-extra-small"></div>
        <GreyButton label={"ショッピングを続ける"} onClick={backToHome} ></GreyButton>
      </div>
    </section>
  )
}

export default FavoriteList
