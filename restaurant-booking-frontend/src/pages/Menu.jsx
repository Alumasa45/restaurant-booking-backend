// src/pages/MenuPage.jsx
import React, { useState } from 'react';

const menuItems = [
  // Starters
  {
    id: 1,
    name: 'Caviar Elegance',
    description: 'Premium black caviar on buttered toast with crème fraîche.',
    price: 'Ksh 2,500',
    image: '/caviar.jpeg',
    category: 'Starters',
  },
  {
    id: 2,
    name: 'Bruschetta',
    description: 'Toasted bread topped with various ingredients like tomatoes, mozzarella, and basil. ',
    price: 'Ksh 1,500',
    image: '/Bruschetta.jpeg',
    category: 'Starters',
  },
  {
    id: 3,
    name: 'Prawn Cocktail',
    description: 'A chilled appetizer featuring cooked prawns in a cocktail sauce.',
    price: 'Ksh 2,800',
    image: '/Prawncocktail.jpeg',
    category: 'Starters',
  },
  {
    id: 4,
    name: 'Tacos',
    description: 'Small tacos with various fillings, often served as appetizers. ',
    price: 'Ksh 500',
    image: '/tacos.jpeg',
    category: 'Starters',
  },
  {
    id: 5,
    name: 'Dips',
    description: 'Various dips like hummus, baba ghanoush, or guacamole, served with pita bread or vegetables.',
    price: 'Ksh 1,500',
    image: '/dips.jpeg',
    category: 'Starters',
  },
  {
    id: 6,
    name: 'Chicken Satay Skewers',
    description: 'Marinated chicken skewers grilled and served with a peanut sauce.(5 skewers)',
    price: 'Ksh 1,500',
    image: '/satay.jpeg',
    category: 'Starters',
  },
  // Mains
  {
    id: 7,
    name: 'Grilled Salmon with Lemon Butter',
    description: 'Atlantic salmon grilled and served with lemon butter sauce.',
    price: 'Ksh 1,200',
    image: '/salmon.jpeg',
    category: 'Mains',
  },
  {
    id: 3,
    name: 'Truffle Mushroom Pasta',
    description: 'Linguine with sautéed mushrooms and truffle oil.',
    price: 'Ksh 950',
    image: '/tmushroom.jpeg',
    category: 'Mains',
  },
  {
    id: 4,
    name: 'Chargrilled Ribeye Steak',
    description: 'Ribeye steak with garlic herb butter, fries & veggies.',
    price: 'Ksh 1,800',
    image: '/steak.jpeg',
    category: 'Mains',
  },
  {
    id: 5,
    name: 'Lobster Thermidor',
    description: 'Creamy lobster baked with cheese, mushrooms & brandy.',
    price: 'Ksh 3,200',
    image: '/lobster.jpeg',
    category: 'Mains',
  },
  {
    id: 6,
    name: 'Chicken biryani',
    description: 'Tender chicken and fragrant basmati rice, seasoned with aromatic spices and herbs, making it a flavorful and satisfying meal. (Can be served in platters.)',
    price: 'Ksh 1,500 - 4,200',
    image: '/biryani.jpeg',
    category: 'Mains',
  },
  {
    id: 7,
    name: 'Pilau',
    description: 'Beautiful fragrant rice dish made with many aromatic spices that adds an amazing depth of flavor to the rice. (Both chicken and Beef)Can alsobe served in platters.',
    price: 'Ksh 2,500 - 3,200',
    image: '/pilau.jpeg',
    category: 'Mains',
  },
  {
    id: 8,
    name: 'Naan bread served with butter chicken',
    description: 'Flat-like, yeast leavened, oven baked bread served with a mild curry consisting of chicken pieces marinated in yoghurt and spices, and cooked in a creamy tomato-based sauce.',
    price: 'Ksh 3,200',
    image: '/naan.jpeg',
    category: 'Mains',
  },
  {
    id: 9,
    name: 'Chapati-Coconut beans',
    description: 'Creamy yellow beans with coconut cream. Served with 3 soft chapatis.',
    price: 'Ksh 800',
    image: '/chapo.jpeg',
    category: 'Mains',
  },
  {
    id: 10,
    name: 'Terriyaki Chicken Burger',
    description: 'Chicken breast marinated in terriyaki sauce, grilled on a skillet, topped with cheese and served on lettuce in a bun, with caramelized pineapples and onions on the side.',
    price: 'Ksh 1,050',
    image: '/burger.jpeg',
    category: 'Mains',
  },
  {
    id: 11,
    name: 'Rainbow Roll Sushi',
    description: 'Our new special!!! a California roll (with fillings like crab, avocado, and cucumber) topped with various colorful slices of raw fish like tuna, salmon, and yellowtail.',
    price: 'Ksh 1,350',
    image: '/sushi.jpeg',
    category: 'Mains',
  },

  // Desserts
  {
    id: 12,
    name: 'Chocolate Lava Cake',
    description: 'Warm cake with gooey center, served with vanilla ice cream.',
    price: 'Ksh 750',
    image: '/choco.jpeg',
    category: 'Desserts',
  },
  {
    id: 13,
    name: 'Biscoff Cheese Cake',
    description: 'Crispy yet chewy, with a delightful caramel tinge.',
    price: 'Ksh 925',
    image: '/biscoff.jpeg',
    category: 'Desserts',
  },
  {
    id: 14,
    name: 'Tiramisu',
    description: 'A layered Italian dessert consisting of ladyfingers soaked in espresso, layered with a rich mascarpone cream, and topped with cocoa powder.',
    price: 'Ksh 920',
    image: '/tiramisu.jpeg',
    category: 'Desserts',
  },
  {
    id: 15,
    name: 'Banoffee Pie',
    description: 'Classic combo of bananas and toffee piled with whipped cream.',
    price: 'Ksh 900',
    image: '/bano.jpeg',
    category: 'Desserts',
  },
  {
    id: 16,
    name: 'Cocada',
    description: 'irresistibly sweet and chewy coconut bark is made with just 2 simple ingredients; shredded coconut and sweet condensed milk.',
    price: 'Ksh 750',
    image: '/cocada.jpeg',
    category: 'Desserts',
  },
  {
    id: 17,
    name: 'Strawberry Pretzel Salad',
    description: 'The pretzels are salty and mixed with butter and sugar. The cream cheese is tangy and folded together with light and airy whipped topping. And the strawberry gelatin is packed with a whole pound of fresh strawberries and provides a tart sweetness to finish off the dish. The trio of flavors — salty-sweet, tangy and tart — are layered together for the perfect dessert with a hometown feel.',
    price: 'Ksh 750',
    image: '/pretzel.jpeg',
    category: 'Desserts',
  },
  {
    id: 18,
    name: 'Low Fat Cheesecake',
    description: 'A combination of Neufchatel cheese (a French cheese that is naturally low in fat), reduced-fat sour cream and fat-free cream cheese.',
    price: 'Ksh 750',
    image: '/lfat.jpeg',
    category: 'Desserts',
  },
  {
    id: 19,
    name: 'Irish cream poke cake',
    description: 'spiked with the flavors of Irish coffee for a rich and flavorful adult dessert.',
    price: 'Ksh 750',
    image: '/poke.jpeg',
    category: 'Desserts',
  },
  // Drinks
  {
    id: 20,
    name: 'Vintage Red Wine',
    description: 'Bold and balanced, perfect with red meats. Choose your brand.',
    price: 'Ksh 1,500',
    image: '/rwine.jpeg',
    category: 'Drinks',
  },
  {
    id: 21,
    name: 'Classic Mojito',
    description: 'Refreshing mint, lime, and soda cocktail.',
    price: 'Ksh 700',
    image: '/mojito.jpeg',
    category: 'Drinks',
  },
  {
    id: 22,
    name: 'Juices.',
    description: 'We have a variety of juices; Carrot, Pineaple, Apple, Beetroot, Passion and cocktails.',
    price: 'Ksh 400',
    image: '/juice.jpeg',
    category: 'Drinks',
  },
  {
    id: 23,
    name: 'Boba Milk shakes',
    description: 'Enjoy our boba milkshakes in different flavours; Vanilla Boa, Chocolate Boba, Strawberry Boba, Oreo Boba, Peanut Boba, Caramel Boba and Tropical Boba.',
    price: 'Ksh 500',
    image: '/Boba.jpeg',
    category: 'Drinks',
  },
  {
    id: 24,
    name: 'Smoothies',
    description: 'Enjoy our smoothies.We serve; Banana smoothie, Mango smoothie, Strawberry smoothie, Avocado smoothie and Tropical smoothie.',
    price: 'Ksh 450',
    image: '/smoothies.jpeg',
    category: 'Drinks',
  },
  {
    id: 25,
    name: 'Iced drinks',
    description: 'Refreshing chilled drinks. We serve; Iced herbal tea, iced tea, iced lemon ginger, iced Palmer, iced tea with choice of Juice, Iced Latte and Iced Mocha.',
    price: 'Ksh 350',
    image: '/iced.jpeg',
    category: 'Drinks',
  },
  {
    id: 26,
    name: 'Tea',
    description: 'Lemon tea, Black Tea, Cow Tea special, Somali Tea- Dawa, Green Tea, Herbal Tea, Hot chocolate.',
    price: 'Ksh 300',
    image: '/tea.jpeg',
    category: 'Drinks',
  },
];

const categories = ['Starters', 'Mains', 'Desserts', 'Drinks'];

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState('Starters');

  const filteredItems = menuItems.filter(
    (item) => item.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-beige-100 px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-brown-800 mb-8">
        Our Exquisite Menu.
      </h1>

      {/* Category Tabs */}
      <div className="flex justify-center mb-10 space-x-4 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full font-medium transition ${
              activeCategory === cat
                ? 'bg-gold-500 text-white shadow'
                : 'bg-white text-brown-800 border border-gold-500'
            } hover:bg-gold-600 hover:text-white`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-60 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-brown-700">{item.name}</h2>
              <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gold-600 font-bold text-lg">{item.price}</span>
                <button className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-1.5 rounded-full text-sm shadow-sm">
                  Order.
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
