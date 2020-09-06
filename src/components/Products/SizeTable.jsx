import React from "react";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import IconButton from "@material-ui/core/IconButton";
import TableContainer from "@material-ui/core/TableContainer";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { makeStyles } from "@material-ui/styles";
// import {addProduct} from '../../templates/ProductDetail';
import { getProductsInFavorite } from "../../redux/users/selectors";
import { useSelector } from "react-redux";
import { getUserId } from "../../redux/users/selectors";
import { db } from "../../firebase/index";

const useStyles = makeStyles({
  iconCell: {
    padding: 0,
    width: 48,
    height: 48,
  },
  iconRed: {
    color: "red",
  },
});

const SizeTable = (props) => {
  const classes = useStyles();
  const sizes = props.sizes;
  const selector = useSelector((state) => state);
  const uid = getUserId(selector);
  const productsInFavorite = getProductsInFavorite(selector);
  let isFavoriteConfirm = [];
  productsInFavorite.forEach((product) => {
    const productId = product.productId;
    const productSize = product.size;
    const confirmObj = {
      productId: productId,
      productSize: productSize,
    };
    isFavoriteConfirm.push(confirmObj);
  });

  const deleteFavorite = (id) => {
    db.collection("users").doc(uid).collection("favorite").doc(id).delete();
  };

  return (
    <TableContainer>
      <Table>
        <TableBody>
          {sizes.length > 0 &&
            sizes.map((size) => (
              <TableRow key={size.size}>
                <TableCell component="th" scope="row">
                  {size.size}
                </TableCell>
                <TableCell>残り{size.quantity}点</TableCell>
                <TableCell className={classes.iconCell}>
                  {size.quantity > 0 ? (
                    <IconButton onClick={() => props.addProduct(size.size)}>
                      <ShoppingCartIcon />
                    </IconButton>
                  ) : (
                    <div>売切</div>
                  )}
                </TableCell>
                <TableCell className={classes.iconCell}>
                  {size.quantity > 0 ? (
                    <IconButton>
                      {(isFavoriteConfirm.findIndex((eachProduct) => (eachProduct.productId === props.productId && eachProduct.productSize === size.size)) === -1) ? (
                        <FavoriteBorderIcon
                          onClick={() => props.addFavorite(size.size)}
                        />
                      ) : (
                        <FavoriteIcon
                          className={classes.iconRed}
                          onClick={() => deleteFavorite(
                              productsInFavorite[
                                isFavoriteConfirm.findIndex((eachProduct) => (eachProduct.productId === props.productId && eachProduct.productSize === size.size))
                              ].favoriteId
                            )
                          }
                        />
                        //ここをfavoriteIdにしなければならない。
                        //少し冗長になったが、
                        //isFavoriteConfirm.findIndex(eachProduct => (eachProduct.productId === props.productId && eachProduct.productSize === size.size))
                        // これが肝
                      )}
                    </IconButton>
                  ) : (
                    <div>売切</div>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SizeTable;
