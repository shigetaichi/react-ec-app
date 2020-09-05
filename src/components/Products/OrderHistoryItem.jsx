import React from 'react';
import Divider from "@material-ui/core/Divider";
import {OrderedProducts} from "./index";
// import {datetimeToString, dateToString} from "../../function/common";
import {TextDetail} from "../UIkit";

const datetimeToString = (date) => {
  return date.getFullYear() + '-' 
      + ('00' + (date.getMonth()+1)).slice(-2) + '-'
      + ('00' + (date.getDate()+1)).slice(-2) + ''
      + ('00' + (date.getHours()+1)).slice(-2) + ':'
      + ('00' + (date.getMinutes()+1)).slice(-2) + ':'
      + ('00' + (date.getSeconds()+1)).slice(-2);
}

const dateToString = (date) => {
  return date.getFullYear() + '-' 
      + ('00' + (date.getMonth()+1)).slice(-2) + '-'
      + ('00' + (date.getDate()+1)).slice(-2);
}

const OrderHistoryItem = (props) => {
  const price = "¥" + props.order.amount.toLocaleString();
  const orderedDateTime = datetimeToString(props.order.updated_at.toDate());
  const shippingDate = dateToString(props.order.shipping_date.toDate());
  return (
    <div>
      <div className="module-spacer--small"></div>
      <TextDetail label={"注文ID"} value={props.order.id} />
      <TextDetail label={"注文日時"} value={orderedDateTime} />
      <TextDetail label={"発送予定日"} value={shippingDate} />
      <TextDetail label={"注文金額"} value={price} />
      {props.order.products.length > 0 && 
        <OrderedProducts products={props.order.products} />
      }
      <div className="module-spacer--extra-extra-small"></div>
      <Divider/>
    </div>
  )
}

export default OrderHistoryItem
