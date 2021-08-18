import React, { useEffect } from 'react';
import "./../../styles/float-btn.css";
import "./../../styles/app.css";

import { useStoreContext } from '../../utils/GlobalState';
import { useLazyQuery } from '@apollo/client';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { loadStripe } from '@stripe/stripe-js';

export default function ShoppingCart() {

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE);

  const [state] = useStoreContext();
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  function submitCheckout() {
    const cart = [];

    state.cart.forEach((item) => {
      cart.push({
        addon: item.addon,
        quantity: item.quantity,
        menuItem: item._id,
      });
    });

    getCheckout({
      variables: { cart },
    });
  }

  function calculateTotal() {
    let sum = 0;
    state.cart.forEach((item) => {
      sum += item.price * item.quantity;
    });
    return sum.toFixed(2);
  }

  return (
    <>
      <h1 className="">Your Cart</h1>
      <section className="card-table">
        <table className="table-rounded table is-hoverable is-bordered text-shadow ">
          {/* <thead className=" is-narrow "> */}
          <thead className="">
            <tr>
              <th>
                <i className="fas fa-utensils"> </i>
              </th>
              <th>
                <abbr title="Quantity">Qty</abbr>
              </th>
              <th>
                <i className="fas fa-dollar-sign"> </i>
              </th>
            </tr>
          </thead>
          {/* </thead> */}
          <tbody className="">
            {state.cart.map((item) => {
              return (
                <tr >
                  <td >{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <p className="text-shadow subtotal">
          <strong>Subtotal:</strong>
          ${calculateTotal()}
        </p>
      </section>

      <div className="float">
        <i onClick={submitCheckout} className="far fa-credit-card my-float">
          <br />Pay</i>
      </div>
    </>
  );
}
