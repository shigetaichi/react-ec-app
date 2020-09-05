import React, {useCallback, useState, useEffect} from 'react';
import { TextInput, SelectBox, PrimaryButton } from '../components/UIkit';
import { SaveProduct } from '../redux/products/operations';
import { useDispatch } from 'react-redux';
import ImageArea from '../components/Products/ImageArea';
import { db } from '../firebase';
import SetSizeArea from '../components/Products/SetSizeArea';

const ProductEdit = () => {
  const dispatch = useDispatch();

  let id = window.location.pathname.split('/product/edit')[1];
  // console.log('Before split /', id );
  
  if(id !== ""){
    id = id.split('/')[1];
    // console.log("After split /", id);
  }

  const [name, setName] = useState(""),
        [description, setDescription] = useState(""),
        [category, setCategory] = useState(""),
        [categories, setCategories] = useState([]),
        [gender, setGender] = useState(""),
        [price, setPrice] = useState(""),
        [images, setImages] = useState([]),
        [sizes, setSizes] = useState([]);

  const inputName = useCallback( (event) => {
    setName(event.target.value);
  },[setName]);
  const inputDescription = useCallback( (event) => {
    setDescription(event.target.value);
  },[setDescription]);
  const inputPrice = useCallback( (event) => {
    setPrice(event.target.value);
  },[setPrice]);

  
  const genders = [
    {id: "all", name: "全て",},
    {id: "male", name: "メンズ",},
    {id: "female", name: "レディース",}
  ];

  useEffect( () => {
    if(id !== ""){
      db.collection('products').doc(id).get()
      .then( snapshot => {
        const data = snapshot.data();
        // console.log(data);
        setImages(data.images);
        setName(data.name);
        setDescription(data.description);
        setCategory(data.category);
        setGender(data.gender);
        setPrice(data.price);
        setSizes(data.sizes);
      })
    }
  }, [id]);

  useEffect(() => {
    db.collection('categories')
      .orderBy('order', 'asc')
      .get()
      .then(snapshots => {
        const list = [];
        snapshots.forEach(snapshot => {
          const data = snapshot.data();
          list.push({
            id: data.id,
            name: data.name,
          });
        });
        setCategories(list);
      });
  }, []);
  
  return (
    <section>
      <h2 className="u-text__headline u-text-center">商品の登録・編集</h2>
      <div className="c-section-container">
        <ImageArea images={images} setImages={setImages} />
        <TextInput
          fullWidth={true} label={"商品名"} multiline={false} required={true}
          rows={1} value={name} type={"text"} onChange={inputName}
        />
        <TextInput
          fullWidth={true} label={"商品の説明"} multiline={true} required={true}
          rows={5} value={description} type={"text"} onChange={inputDescription}
        />
        <SelectBox
          label={"カテゴリー"} required={true} select={setCategory} value={category} options={categories}
        />
        <SelectBox
          label={"性別"} required={true} select={setGender} value={gender} options={genders}
        />
        <TextInput
          fullWidth={true} label={"価格"} multiline={false} required={true}
          rows={1} value={price} type={"number"} onChange={inputPrice}
        />
        <div className="module-spacer--medium"></div>
        <SetSizeArea
          sizes={sizes} setSizes={setSizes}
        />
        <div className="module-spacer--small"></div>
        <div className="center">
          <PrimaryButton
            label={"商品情報を保存"} onClick={() => dispatch(SaveProduct(id, name, description, category, gender, price, images, sizes))}
          />
        </div>
      </div>
    </section>
  )
}

export default ProductEdit;