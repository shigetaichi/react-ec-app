import { FirebaseTimeStamp, db } from '../../firebase/index';
import { push } from 'connected-react-router';
import { deleteProductAction, fetchProductsAction } from '../../redux/products/actions';

const productsRef = db.collection('products');

export const orderProduct = (productsInCart, price) => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const userRef = db.collection('users').doc(uid);
    const timestamp = FirebaseTimeStamp.now();

    let products = [],
        soldOutProduct = [];
    
    const batch = db.batch();

    for(const product of productsInCart){
      const snapshot = await productsRef.doc(product.productId).get();
      const sizes = snapshot.data().sizes;

      const updatedSizes = sizes.map(size => {
        if(size.size === product.size){
          if(size.quantity === 0){
            soldOutProduct.push(product.name);
            return size;
          }
          return {
            size: size.size,
            quantity: size.quantity - 1,
          }
        }else{
          return size;
        }
      })

      products.push({
        id: product.productId,
        images: product.images,
        name: product.name,
        price: product.price,
        size: product.size,
      })

      batch.update(
        productsRef.doc(product.productId),
        {sizes: updatedSizes}
      );

      batch.delete(
        userRef.collection('cart').doc(product.cartId)
      )
    }

    if(soldOutProduct.length > 0){
      const errorMessage = (soldOutProduct.length > 1) ? soldOutProduct.join('と') : soldOutProduct[0];
      alert('大変申し訳ありませんが' + errorMessage + 'が現在在庫切れとなったため、注文処理を中断いたしました。');
      return false;
    }else{
      batch.commit()
      .then(() => {
        const orderRef = userRef.collection('orders').doc();
        const date = timestamp.toDate();
        const shippingDate = FirebaseTimeStamp.fromDate( new Date(date.setDate(date.getDate() + 3)) );

        const history = {
          amount: price,
          created_at: timestamp,
          id: orderRef.id,
          products: products,
          shipping_date: shippingDate,
          updated_at: timestamp,
        }

        orderRef.set(history);
        dispatch(push('/order/complete'));
      }).catch(() => {
        console.log('failed');
        alert('注文処理に失敗しました。通信環境等をご確認ください。');
        return false;
      })
    }
  }
}

export const deleteProduct = (id) => {
  return async (dispatch, getState) => {
    productsRef.doc(id).delete()
        .then( () => {
          const prevProducts = getState().products.list;
          const nextProducts = prevProducts.filter(product => product.id !== id);
          dispatch(deleteProductAction(nextProducts));
        })
  }
}

export const fetchProducts = (gender, category) => {
  return async (dispatch) => {
    let query = productsRef.orderBy('updated_at', 'desc');
    query = (gender !== "") ? query.where('gender', '==', gender) : query;
    query = (category !== "") ? query.where('category', '==', category) : query;
    //orderByは二つの引数。第一引数には何で並び替えるか。第二引数は昇順か降順か。
    query.get()
          .then( snapshots => {
            const productList = [];
            snapshots.forEach( (snapshot) => {
              const product = snapshot.data();
              productList.push(product);
            });
            dispatch(fetchProductsAction(productList));
          })
  }
}

export const SaveProduct = (id, name, description, category, gender, price, images, sizes) => {
  return async (dispatch) => {
    const timestamp = FirebaseTimeStamp.now();

    if(name === ""){
      console.log("NO NAME");
      return false;
    }

    const data = {
      category: category,
      description: description,
      gender: gender,
      images: images,
      name: name,
      price: parseInt(price, 10),
      sizes: sizes,
      updated_at: timestamp,
    }
    console.log(data);
    

    if(id === ""){
      const ref = productsRef.doc();
      console.log(ref);
      
      id = ref.id;
      data.id = id;
      data.created_at = timestamp;
      // console.log(id);
      // console.log(data.id);
    }
    

    return productsRef.doc(id).set(data, {merge: true})
            .then( () => {
              dispatch(push('/'))
            })
            .catch( () => {
              throw new Error()
            })
  }
}