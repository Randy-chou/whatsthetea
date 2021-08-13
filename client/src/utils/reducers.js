import { useReducer } from 'react';
import {
  UPDATE_ORDER,
  ADD_TO_CART,
  UPDATE_CART_QUANTITY,
  REMOVE_FROM_CART,
  ADD_MULTIPLE_TO_CART,
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
  CLEAR_CART,
  TOGGLE_CART,
} from './actions';


export const reducer = (state, action) => {
  switch (action.type) {
  
    case UPDATE_ORDER:
      return {
        ...state,
        order: [...action.order],
      };

    case ADD_TO_CART:
      return {
        ...state,
        cartOpen: true,
        cart: [...state.cart, action.order],
      };
    case ADD_MULTIPLE_TO_CART:
      return {
        ...state,
        cart: [...state.cart, ...action.order],
      };
   
    case UPDATE_CART_QUANTITY:
      return {
        ...state,
        cartOpen: true,
        cart: state.cart.map((order) => {
          if (action._id === order._id) {
            order.purchaseQuantity = action.purchaseQuantity;
          }
          return order;
        }),
      };

   
    case REMOVE_FROM_CART:
      let newState = state.cart.filter((order) => {
        return order._id !== action._id;
      });

   
      return {
        ...state,
        cartOpen: newState.length > 0,
        cart: newState,
      };

    case CLEAR_CART:
      return {
        ...state,
        cartOpen: false,
        cart: [],
      };

    case TOGGLE_CART:
      return {
        ...state,
        cartOpen: !state.cartOpen,
      };

    case UPDATE_CATEGORIES:
      return {
        ...state,
        categories: [...action.categories],
      };

    case UPDATE_CURRENT_CATEGORY:
      return {
        ...state,
        currentCategory: action.currentCategory,
      };

    default:
      return state;
  }
};

export function useOrderReducer(initialState) {
  return useReducer(reducer, initialState);
}
