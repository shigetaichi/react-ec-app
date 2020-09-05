import React from 'react';
import { Route, Switch } from 'react-router';
import { SignUp, SignIn, Reset, ProductEdit, ProductList, ProductDetail, CartList, FavoriteList, OrderConfirm, OrderHistory } from './templates/index';
import Auth from './Auth';

const Router = () => {
  return(
    <Switch>
      <Route exact path={"/signup"} component={SignUp} />
      <Route exact path={"/signin"} component={SignIn} />
      <Route exact path={"/signin/reset"} component={Reset} />

      <Auth>
        <Route exact path={"(/)?"} component={ProductList} />
        <Route exact path={"/product/:id"} component={ProductDetail} />
        {/* ここでは、exactをつけよう！じゃないと、下の場合も適応されちゃうよ！ */}
        <Route path={"/product/edit(/:id)?"} component={ProductEdit} />
        <Route path={"/cart"} component={CartList} />
        <Route path={"/favorite"} component={FavoriteList} />
        <Route path={"/order/confirm"} component={OrderConfirm} />
        <Route path={"/order/history"} component={OrderHistory} />
      </Auth>
    </Switch>
  )
}

export default Router;