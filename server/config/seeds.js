const db = require('./connection');
const { User, Review, Restaurant, Order, MenuItem } = require('../models');

db.once('open', async () => {
  await MenuItem.deleteMany();
  const MenuItems = await MenuItem.insertMany([
    {
      name: "Honey Chicken",
      image: "https://res.cloudinary.com/dx1djlhrd/image/upload/v1628783142/placeholder-300x202_jlbtx4.jpg",
      description: "Crispy chicken with a honey glaze",
      price: 11.99,
    },
    {
      name: "Garlic Chicken",
      image: "https://res.cloudinary.com/dx1djlhrd/image/upload/v1628783142/placeholder-300x202_jlbtx4.jpg",
      description: "Garlic infused crispy chicken",
      price: 11.99,
    },
    {
      name: "House Special",
      image: "https://res.cloudinary.com/dx1djlhrd/image/upload/v1628783142/placeholder-300x202_jlbtx4.jpg",
      description: "Crispy Chicken tossed with original house blend",
      price: 10.99,
    },
    {
      name: "Berry Blast",
      image: "https://res.cloudinary.com/dx1djlhrd/image/upload/v1628783142/placeholder-300x202_jlbtx4.jpg",
      description: "The ultimate berry blend",
      price: 7.99,
    },
    {
      name: "Honeydew Greentea",
      image: "https://res.cloudinary.com/dx1djlhrd/image/upload/v1628783142/placeholder-300x202_jlbtx4.jpg",
      description: "Honeydew blended with a greentea infusion",
      price: 8.99,
    },
    {
      name: "Cheeseburger",
      image: "https://res.cloudinary.com/dx1djlhrd/image/upload/v1628783142/placeholder-300x202_jlbtx4.jpg",
      description: "A house standard cheeseburger",
      price: 9.99,
    },
    {
      name: "Double Up Burger",
      image: "https://res.cloudinary.com/dx1djlhrd/image/upload/v1628783142/placeholder-300x202_jlbtx4.jpg",
      description: "Double patty cheeseburger",
      price: 13.99,
    },
  ]);
  console.log('MenuItems seeded');

  await Restaurant.deleteMany();
  const Restaurants = await Restaurant.insertMany([
    { 
        name: 'Korean Chicken',
        logo: 'https://res.cloudinary.com/dx1djlhrd/image/upload/v1628783142/placeholder-300x202_jlbtx4.jpg',
        location: 'adress1',
        tags: ['asian', 'korean'],
        rating: 3,
        menu: [MenuItems[0]._id, MenuItems[1]._id, MenuItems[2]._id]
    },
    { 
        name: 'Jamba Juice',
        logo: 'https://res.cloudinary.com/dx1djlhrd/image/upload/v1628783142/placeholder-300x202_jlbtx4.jpg',
        location: 'adress2',
        tags: ['healthy'],
        rating: 4,
        menu: [MenuItems[3]._id, MenuItems[4]._id]
    },
    { 
        name: 'BurgerJoint',
        logo: 'https://res.cloudinary.com/dx1djlhrd/image/upload/v1628783142/placeholder-300x202_jlbtx4.jpg',
        location: 'adress3',
        tags: ['burger'],
        rating: 2,
        menu: [MenuItems[5]._id, MenuItems[6]._id]
    },
  ]);
  console.log('Restaurants seeded');

  await Order.deleteMany();
  const Orders = await Order.insertMany([
    {cart: [
      {
        quantity: 1,
        addon: "Extra honey on the side",
        menuItem: MenuItems[0]._id
      },{
        quantity: 2,
        addon: "Hold the chicken",
        menuItem: MenuItems[1]._id
      },{
        quantity: 2,
        addon: "Extra chicken",
        menuItem: MenuItems[2]._id
      }
    ]},
    {cart: [
      {
        menuItem: MenuItems[3]._id
      },{
        menuItem: MenuItems[4]._id
      }
    ]}
  ]);
  console.log('Orders seeded');

  await User.deleteMany();
  const firstUser = await User.create({
    username: 'test',
    email: 'test@email.com',
    password: 'password',
    profileImg: 'https://res.cloudinary.com/dx1djlhrd/image/upload/v1628748200/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju_dz9cwo.jpg',
    pastOrders: [Orders[0]._id, Orders[1]._id],
  });
  console.log('Users seeded');

  await Review.deleteMany();
  const Reviews = await Review.insertMany([
    {
      user: firstUser._id,
      type: "MenuItem",
      content: "The chicken was nice and fresh!",
      rating: "4",
    },
    {
      user: firstUser._id,
      type: "Restaurant",
      content: "Customer service was fantastic!",
      rating: "4",
    },
  ])
  console.log('Reviews seeded');

  firstUser.reviews.push(Reviews[0]._id);
  firstUser.reviews.push(Reviews[1]._id);
  await firstUser.save();

  updateMenu = MenuItems[0];
  updateMenu.reviews.push(Reviews[0]._id);
  await updateMenu.save();

  updateRes = Restaurants[0];
  updateRes.reviews.push(Reviews[1]._id);
  await updateRes.save();

  console.log('Reviews added');

  process.exit();
});
