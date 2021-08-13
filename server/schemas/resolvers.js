const { AuthenticationError } = require('apollo-server-express');
const { User, Review, Restaurant, PurchasedItem, Order, MenuItem } = require('../models');
const { signToken } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user && context.user._id) {
        const user = await User.findById(context.user._id)
        .populate({
          path: 'pastOrders',
          populate: {
            path: 'cart.menuItem',
          }
        })
        .populate('reviews');

        return user;
      }

      throw new AuthenticationError('Not logged in');
    },

    allRestaurants: async () => {
      const restaurants = await Restaurant.find({})
      .populate({
        path: 'menu',
        populate: {
          path: 'reviews',
          populate: {
            path: 'user'
          }
        }
      })
      .populate({
        path: 'reviews',
        populate: {
          path: 'user'
        }
      });
      return restaurants;
    },

    allMenuItems: async () => {
      const menuItems = await MenuItem.find({})
      .populate({
        path: 'reviews',
          populate: {
            path: 'user'
          }
      });
      return menuItems;
    },

    restaurants: async (parent, { searchTerm, tag }) => {
      const params = {};

      if (tag) {
        params.tags = tag;
      }

      if (searchTerm) {
        params.name = {
          $regex: searchTerm,
          $options: 'i'
        };
      }

      return await Restaurant.find(params)
      .populate({
        path: 'menu',
        populate: {
          path: 'reviews',
          populate: {
            path: 'user'
          }
        }
      })
      .populate({
        path: 'reviews',
        populate: {
          path: 'user'
        }
      });
    },

    checkout: async (parent, {cart}, context) => {
      const url = new URL(context.headers.referer).origin;
      const order = new Order({ cart });
      const line_items = [];

      const { products } = await order.populate('cart.menuItem').execPopulate();

      for (let i = 0; i < products.length; i++) {
        const product = await stripe.products.create({
          name: products[i].name,
          description: products[i].description,
          images: [`${url}/images/${products[i].image}`]
        });

        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: products[i].price * 100,
          currency: 'usd',
        });

        line_items.push({
          price: price.id,
          quantity: 1
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`
      });

      return { session: session.id };
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    addOrder: async (parent, { cart }, context) => {
      if (context.user && context.user._id) {

        const order = await Order.create({ cart });

        await User.findByIdAndUpdate(context.user._id, { $push: { pastOrders: order._id } });

        return order.populate('cart.menuItem').execPopulate();
      }
      
      throw new AuthenticationError('Not logged in');
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, { new: true });
      }

      throw new AuthenticationError('Not logged in');
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    }
  }
};

module.exports = resolvers;
