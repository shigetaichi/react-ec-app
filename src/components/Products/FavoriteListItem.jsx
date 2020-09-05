import React from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {makeStyles} from "@material-ui/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import {useSelector} from "react-redux";
import {getUserId} from "../../redux/users/selectors";
import {db} from "../../firebase/index"

const useStyles = makeStyles({
  list: {
    height: 128,
  },
  image: {
    objectFit: "cover",
    margin: 16,
    height: 96,
    width: 96,
  },
  text: {
    width: "100%",
  }
})

const FavoriteListItem = (props) => {
  const classes = useStyles();
  const image = props.product.images[0].path;
  const price = props.product.price.toLocaleString();
  const size = props.product.size;
  const selector = useSelector(state => state);
  const uid = getUserId(selector);

  const removeProductFromFavorite = (id) => {
    db.collection('users').doc(uid)
      .collection('favorite').doc(id).delete();
  }

  return (
    <>
      <ListItem classes={classes.list}>
        <ListItemAvatar>
          <img className={classes.image} src={image} alt="商品画像"/>
        </ListItemAvatar>
        <div className={classes.text}>
          <ListItemText primary={props.product.name} secondary={"サイズ：" + size} />
          <ListItemText primary={"￥" + price} secondary={"サイズ：" + price} />
        </div>
        <IconButton>
          <DeleteIcon onClick={() => removeProductFromFavorite(props.product.favoriteId)}/>
        </IconButton>
      </ListItem>
      <Divider/>
    </>
  )
}

export default FavoriteListItem
