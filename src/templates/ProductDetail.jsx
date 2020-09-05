import React, {useState, useEffect, useCallback} from 'react'
import { db, FirebaseTimeStamp } from '../firebase';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import HTMLReactParser from 'html-react-parser';
import { ImageSwiper } from '../components/Products/index';
import SizeTable from '../components/Products/SizeTable';
import {addProductToCart, addProductToFavorite} from '../redux/users/operations';

const useStyles = makeStyles( (theme) => (
  {
    sliderBox: {
      [theme.breakpoints.down('sm')]: {
        margin: '0 auto 24px',
        height: 320,
        width: 320,
      },
      [theme.breakpoints.up('sm')]: {
        margin: '0 auto',
        height: 400,
        width: 400,
      }
    },
    detail: {
      textAlign: 'left',
      [theme.breakpoints.down('sm')]: {
        margin: '0 auto 16px',
        height: 'auto',
        width: 320,
      },
      [theme.breakpoints.up('sm')]: {
        margin: '0 auto',
        height: 'auto',
        width: 400,
      }
    },
    price: {
      fontSize: 36,
    }
  }
))

const returnCodeToBr = (text) => {
  if(text === "") {
    return text;
  } else {
    return HTMLReactParser(text.replace(/\r?\n/g, '<br>'))
  }
}


const ProductDetail = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector(state => state);
  // console.log(selector);
  const path = selector.router.location.pathname;
  const id = path.split('/product/')[1];

  const [product, setProduct] = useState(null);

  const addProduct = useCallback(
    (selectedSize) => {
      const timestamp = FirebaseTimeStamp.now();
      dispatch(addProductToCart({
        added_at: timestamp,
        description: product.description,
        gender: product.gender,
        images: product.images,
        name: product.name,
        price: product.price,
        productId: product.id,
        quantity: 1,
        size: selectedSize,
      }))
    },[dispatch, product]);

  const addFavorite = useCallback(
    (selectedSize) => {
      const timestamp = FirebaseTimeStamp.now();
      dispatch(addProductToFavorite({
        added_at: timestamp,
        description: product.description,
        gender: product.gender,
        images: product.images,
        name: product.name,
        price: product.price,
        productId: product.id,
        quantity: 1,
        size: selectedSize,
      }))
    },[dispatch, product]);


  useEffect(() => {
    db.collection('products').doc(id).get()
      .then( doc => {
        const data = doc.data();
        setProduct(data);
      })
    console.log("useEffectTriggered");
    
  },[])//ここにidを入れると×
  // FirebaseError: Function CollectionReference.doc() requires its first argument to be of type non-empty string, but it was: undefined
  // こいつが出た。


  return (
    <section className="c-section-wrapin">
      { product && (
        <div className="p-grid__row">
          <div className={classes.sliderBox}>
            <ImageSwiper images={product.images} />
          </div>
          <div className={classes.detail}>
            <h2 className="u-text__headline">{product.name}</h2>
            <p className={classes.price}>{product.price.toLocaleString()}</p>
            <div className="module-spacer--small"></div>
            <SizeTable addProduct={addProduct} addFavorite={addFavorite} sizes={product.sizes} ></SizeTable>
            <div className="module-spacer--small"></div>
            <p>{returnCodeToBr(product.description)}</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductDetail
