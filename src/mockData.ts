import { Vendor, UserAccount, ChatThread, PushNotification } from './types';

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'caterer_1',
    name: 'Gourmet Garden Caterers',
    category: 'caterer',
    cuisine: 'American',
    pricePerGuest: 45,
    minGuests: 15,
    rating: 4.9,
    ratingCount: 142,
    description: 'Elegant farm-to-table catering specializing in modern American cuisine. We design custom stations, elegant pass-around hors d\'oeuvres, and gorgeous grazing tables for birthday celebrations, elegant garden parties, and weddings.',
    imageUrls: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 35,
    pricingNotes: 'Weekend dates (Fri-Sun) carry a 15% peak service surcharge. Standard setup and cleanup service of 2 hours is included in all bookings.',
    customMenuSupported: true,
    weekendRatePercentage: 15,
    blockedDates: ['2026-07-25', '2026-08-01'],
    workingHours: { start: '09:00', end: '21:00' },
    locationName: 'Downtown & Metro Area',
    menuItems: [
      {
        id: 'c1_m1',
        name: 'Artisanal Charcuterie Grazing Platter',
        description: 'Selection of local cheeses, cured meats, raw honeycomb, dried figs, roasted nuts, and baked rosemary sourdough crisps.',
        price: 18,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c1_m2',
        name: 'Crispy Maple Glazed Pork Belly Slider',
        description: 'Slow-braised pork belly, apple fennel slaw, and spicy maple-drizzle on freshly baked brioche buns (Set of 6).',
        price: 24,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c1_m3',
        name: 'Slow Roasted Ribeye Station',
        description: 'Prime ribeye beef carved fresh at your event, served with rosemary fingerling potatoes, roasted asparagus, and red wine demi-glace.',
        price: 42,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c1_m4',
        name: 'White Wine & Herb Steamed Salmon',
        description: 'Wild caught salmon fillets steamed with organic dill, lemon rounds, and dry chardonnay, served over seasonal greens.',
        price: 36,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c1_m5',
        name: 'Salted Caramel Pecan Tart',
        description: 'Shortbread pastry crust filled with buttery salted caramel, fresh roasted pecans, and topped with Madagascar vanilla bean cream.',
        price: 12,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c1_m6',
        name: 'Lavender Hibiscus Infused Mocktail',
        description: 'Organic culinary lavender, brewed hibiscus tea, elderflower tonic, and fresh lime rounds served with ice (Serves 10 guests).',
        price: 45,
        category: 'Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'caterer_2',
    name: 'Fiesta Brava Catering',
    category: 'caterer',
    cuisine: 'Mexican',
    pricePerGuest: 28,
    minGuests: 10,
    rating: 4.8,
    ratingCount: 94,
    description: 'Authentic street taco bars and premium Oaxacan party catering. We bring our full interactive grill station directly to your backyard, cooking fresh off-the-fire tortillas, marinated meats, and hand-shaken mocktails.',
    imageUrls: [
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 25,
    pricingNotes: 'Prices are flat-rate per guest. Includes free chips, salsa bar, and dynamic guac prep station. Travel fees apply for distances above 15 miles.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: ['2026-07-24', '2026-07-26'],
    workingHours: { start: '11:00', end: '23:00' },
    locationName: 'Southend & Suburbs',
    menuItems: [
      {
        id: 'c2_m1',
        name: 'Hand-Mashed Guacamole & Warm Tortilla Chips',
        description: 'Fresh Hass avocados mashed daily with jalapeño, lime, tomato, and fresh cilantro, served with hand-cut crispy yellow corn chips.',
        price: 8,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c2_m2',
        name: 'Charred Street Corn (Elote Cups)',
        description: 'Sweet corn off the cob slathered in spicy lime mayo, cotija cheese, and house chili-lime powder.',
        price: 7,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c2_m3',
        name: 'Unlimited Street Taco Bar',
        description: 'Choose 3 fillings: Carne Asada, Pollo Asado, Barbacoa, or Crispy Jackfruit. Served with fresh diced onion, cilantro, limes, and salsas (per guest).',
        price: 22,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c2_m4',
        name: 'Golden Crispy Churros with Dulce de Leche',
        description: 'Handmade Mexican pastries fried golden, rolled in rich cinnamon sugar, served with warm house-cooked cajeta caramel.',
        price: 8,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'food_truck_1',
    name: 'Slide & Bite Burger Co.',
    category: 'food_truck',
    cuisine: 'American',
    pricePerGuest: 22,
    minGuests: 20,
    rating: 4.7,
    ratingCount: 184,
    description: 'On-demand gourmet slider truck for high-energy backyard bashes, graduations, and block parties. We roll our beautiful vintage chrome truck right into your driveway and serve up hot, smash-style sliders, loaded waffle fries, and cold craft milkshakes.',
    imageUrls: [
      'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 40,
    pricingNotes: 'Minimum truck dispatch fee is $400, which covers travel up to 20 miles. Every hour of service includes continuous, fast ordering directly at the truck window.',
    customMenuSupported: false,
    weekendRatePercentage: 15,
    blockedDates: ['2026-07-20', '2026-07-28'],
    workingHours: { start: '12:00', end: '24:00' },
    locationName: 'Northside & Metro',
    menuItems: [
      {
        id: 'ft1_m1',
        name: 'The OG Smash Slider',
        description: 'Prime double-smashed beef patty, sharp cheddar, grilled onions, house dill pickles, and signature slide sauce on sweet King\'s Hawaiian rolls (Pack of 3).',
        price: 15,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft1_m2',
        name: 'Hot Honey Crispy Chicken Slider',
        description: 'Buttermilk fried chicken breast, red cabbage apple slaw, local clover honey, and ghost pepper jack cheese (Pack of 3).',
        price: 16,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft1_m3',
        name: 'Truffle Garlic Parmesan Waffle Fries',
        description: 'Thick criss-cross waffle cut potatoes tossed in white truffle oil, grated aged parmesan, freshly minced garlic, and rosemary salt.',
        price: 9,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft1_m4',
        name: 'Salted Oreo Chocolate Fudge Shake',
        description: 'Double chocolate chunk gelato, hand-mashed Oreo biscuits, organic whole milk, whipped cream, and sea salt caramel injection.',
        price: 8,
        category: 'Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'food_truck_2',
    name: 'Tokyo Street Yakitori',
    category: 'food_truck',
    cuisine: 'Sushi',
    pricePerGuest: 32,
    minGuests: 15,
    rating: 4.9,
    ratingCount: 76,
    description: 'An immersive Japanese street dining experience. We serve artisanal charcoal-grilled yakitori skewers, crispy hand rolls, and steaming gyoza straight from our custom Japanese timber truck.',
    imageUrls: [
      'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 30,
    pricingNotes: 'Minimum dispatch includes 2 hours of live active grilling. We provide biodegradable bamboo plateware and chopsticks.',
    customMenuSupported: true,
    weekendRatePercentage: 20,
    blockedDates: [],
    workingHours: { start: '16:00', end: '23:00' },
    locationName: 'Metro East',
    menuItems: [
      {
        id: 'ft2_m1',
        name: 'Crispy Pork & Chive Gyoza',
        description: 'Pan-fried Japanese dumplings stuffed with seasoned pork, garlic chives, ginger, cabbage, served with black vinegar dipping sauce (Set of 8).',
        price: 14,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft2_m2',
        name: 'Classic Chicken Negima Skewers',
        description: 'Tender chicken thigh skewers grilled over Japanese binchotan charcoal, glazed in rich sweet soy tare and scallions (Set of 6).',
        price: 18,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft2_m3',
        name: 'Signature Spicy Tuna Crispy Rice',
        description: 'Pan-fried crispy sushi rice squares topped with spicy yellowfin tuna tartare, fresh serrano pepper rings, and sweet unagi drizzle (Set of 6).',
        price: 22,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'chef_1',
    name: "Chef Marco Rossi",
    category: 'private_chef',
    cuisine: 'Italian',
    pricePerGuest: 75,
    minGuests: 4,
    rating: 5.0,
    ratingCount: 112,
    description: 'Michelin-trained Chef Marco Rossi brings fine-dining Italian craftsmanship straight to your private dining room. He specializes in table-side hand-rolled pastas, artisanal seafood crudos, slow-braised Barolo beef short ribs, and bespoke dessert masterclasses. Perfect for intimate anniversaries and upscale home celebrations.',
    imageUrls: [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1621996346565-e3d5d6288339?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 20,
    pricingNotes: 'Hourly slider adds dedicated culinary prep & post-dinner clean. Chef provides premium Italian white plating. Travel fees calculated post-booking.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: ['2026-07-29', '2026-08-05'],
    workingHours: { start: '17:00', end: '22:00' },
    locationName: 'North Hills & Suburbs',
    menuItems: [
      {
        id: 'ch1_m1',
        name: 'Burrata Caprese with Smoked Olive Oil',
        description: 'Fresh Puglian burrata cheese, organic heirloom tomatoes, fresh sweet basil leaves, hand-harvested sea salt flakes, and cold-pressed olive oil.',
        price: 16,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch1_m2',
        name: 'Handmade Black Truffle Tagliolini',
        description: 'Tableside fresh tagliolini pasta tossed in organic double-butter emulsion, wild-harvested Umbrian black truffle paste, and freshly grated 24-month aged Parmigiano Reggiano.',
        price: 34,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch1_m3',
        name: 'Barolo Braised Beef Short Rib',
        description: 'Prime short beef ribs slow-cooked for 48 hours in Barolo red wine reduction, served over creamy white polenta.',
        price: 45,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch1_m4',
        name: 'Tableside Deconstructed Tiramisu',
        description: 'Savoiardi sponge ladyfingers soaked in dark espresso and marsala wine, piped fresh with sweetened organic mascarpone cream, finished with raw cacao dusting.',
        price: 14,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'chef_2',
    name: "Chef Sarah Lin",
    category: 'private_chef',
    cuisine: 'Flexible', // "Multi-Cuisine / Flexible Menu"
    pricePerGuest: 120,
    minGuests: 6,
    rating: 4.9,
    ratingCount: 54,
    description: "Award-winning Chef Sarah Lin is a coastal culinary artist specializing in high-end Japanese Omakase, seasonal seafood tasting menus, and delicate French bistro fusion. She curates bespoke dining experiences customized completely to your guests' preferences, dietary restrictions, and seasonal marine catches.",
    imageUrls: [
      'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 50,
    pricingNotes: 'Chef Sarah can design custom menus tailored specifically to you. Request a "Custom Menu" using our live in-app messaging to receive a digital quote!',
    customMenuSupported: true,
    weekendRatePercentage: 15,
    blockedDates: [],
    workingHours: { start: '11:00', end: '22:00' },
    locationName: 'Entire Metro Coastline',
    menuItems: [
      {
        id: 'ch2_m1',
        name: 'Bespoke Prix-Fixe Omakase (6-Courses)',
        description: 'Curated tasting featuring Bluefin Tuna, King Salmon, Amaebi Sweet Shrimp, and direct premium catches, hand-prepared and served directly to your guests (per person).',
        price: 120,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch2_m2',
        name: 'Pan-Seared Hokkaido Scallops',
        description: 'Premium diver scallops seared with brown butter, roasted sunchoke puree, and yuzu foam.',
        price: 28,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch2_m3',
        name: 'Matcha Lava Fondant Cake',
        description: 'Rich dark chocolate cake filled with a gooey flowing liquid Uji matcha core, served with black sesame seed gelato.',
        price: 15,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },

  // --- 10 NEW RESTAURANTS / CATERERS ---
  {
    id: 'caterer_3',
    name: 'Olympia Greek Taverna',
    category: 'caterer',
    cuisine: 'Greek',
    pricePerGuest: 32,
    minGuests: 12,
    rating: 4.9,
    ratingCount: 118,
    description: 'Authentic Aegean and Mediterranean feast catering. We prepare traditional charcoal-grilled souvlaki skewers, spanakopita, char-grilled octopus, lemon oreganato potatoes, and honey walnut baklava.',
    imageUrls: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 30,
    pricingNotes: 'Includes full Mediterranean salad bar, pita baskets, and handmade tzatziki sauce dips.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '10:00', end: '22:00' },
    locationName: 'Metro East & Harbor',
    menuItems: [
      {
        id: 'c3_m1',
        name: 'Crispy Golden Spanakopita Bites',
        description: 'Flaky phyllo pastry triangles stuffed with organic spinach, Greek feta, fresh dill, and spring onions (Set of 12).',
        price: 18,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c3_m2',
        name: 'Aegean Charcoal Grilled Lamb Souvlaki Platter',
        description: 'Tender marinated lamb skewers charred over real hardwood embers, served with Greek lemon potatoes and tzatziki.',
        price: 32,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c3_m3',
        name: 'Honey Pistachio Baklava Squares',
        description: 'Layered phyllo dough packed with crushed walnuts and pistachios, soaked in orange-blossom thyme honey syrup.',
        price: 10,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'caterer_4',
    name: 'Sakura Izakaya & Sushi Bar',
    category: 'caterer',
    cuisine: 'Sushi',
    pricePerGuest: 48,
    minGuests: 10,
    rating: 4.8,
    ratingCount: 165,
    description: 'Premium Japanese party platters and live sushi display catering. Featuring fresh sashimi wooden boats, dragon rolls, truffle salmon aburi, prawn tempura, and matcha desserts.',
    imageUrls: [
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 35,
    pricingNotes: 'Live sushi chef stations available upon request for events over 25 guests.',
    customMenuSupported: true,
    weekendRatePercentage: 15,
    blockedDates: [],
    workingHours: { start: '11:00', end: '23:00' },
    locationName: 'Downtown Financial District',
    menuItems: [
      {
        id: 'c4_m1',
        name: 'Grand Sashimi & Nigiri Wooden Boat (50 Pcs)',
        description: 'Assorted Bluefin tuna, Hokkaido scallops, King salmon, and Hamachi with fresh grated real wasabi root.',
        price: 110,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c4_m2',
        name: 'Rock Shrimp Tempura in Spicy Yuzu Aioli',
        description: 'Crispy tiger rock shrimp bites tossed in spicy ponzu mayo and chives.',
        price: 22,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c4_m3',
        name: 'Green Tea Matcha Mochi Ice Cream Platter',
        description: 'Handmade Japanese mochi rice cakes stuffed with Kyoto matcha and black sesame gelato.',
        price: 14,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'caterer_5',
    name: 'Le Petit Bistro & Catering',
    category: 'caterer',
    cuisine: 'French',
    pricePerGuest: 52,
    minGuests: 8,
    rating: 4.9,
    ratingCount: 89,
    description: 'Quintessential French country catering. Coq au Vin, Gruyère gougères, braised beef bourguignon crostini, duck confit, and handcrafted salted caramel macarons.',
    imageUrls: [
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 25,
    pricingNotes: 'Wine pairing advice and French Sommelier recommendations included for all custom orders.',
    customMenuSupported: true,
    weekendRatePercentage: 12,
    blockedDates: [],
    workingHours: { start: '10:00', end: '22:00' },
    locationName: 'Westside Arts District',
    menuItems: [
      {
        id: 'c5_m1',
        name: 'Warm Gruyère Cheese Gougères',
        description: 'Light French choux pastry puffs baked with aged Gruyère cheese and smoked paprika (Set of 12).',
        price: 16,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c5_m2',
        name: 'Slow-Braised Burgundy Beef Bourguignon',
        description: 'Tender prime beef chuck simmered for 8 hours in French Pinot Noir with pearl onions, cremini mushrooms, and buttered pomme purée.',
        price: 38,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c5_m3',
        name: 'Assorted Parisian Macaron Tower',
        description: 'Handmade macarons featuring Salted Caramel, Pistachio, Raspberry Rose, and Dark Chocolate Ganache.',
        price: 28,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'caterer_6',
    name: 'Siam Silk Thai Kitchen',
    category: 'caterer',
    cuisine: 'Thai',
    pricePerGuest: 30,
    minGuests: 10,
    rating: 4.8,
    ratingCount: 140,
    description: 'Vibrant Thai banquet catering featuring massaman curry, crispy lemongrass spring rolls, live Pad Thai stations, coconut galangal soups, and sweet mango sticky rice.',
    imageUrls: [
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 30,
    pricingNotes: 'Custom spice levels from mild to authentic Thai hot.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '11:30', end: '22:00' },
    locationName: 'Central Plaza & North',
    menuItems: [
      {
        id: 'c6_m1',
        name: 'Crispy Lemongrass Vegetable Spring Rolls',
        description: 'Hand-rolled glass noodles, shiitake mushrooms, and fresh cabbage with sweet plum dipping sauce.',
        price: 14,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c6_m2',
        name: 'Royal Massaman Beef Short Rib Curry',
        description: 'Slow-cooked bone-in beef short rib in rich coconut massaman curry with roasted peanuts and crushed cardamom.',
        price: 34,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c6_m3',
        name: 'Fresh Mango Sweet Sticky Rice',
        description: 'Ripe Honey Gold mango slices over warm pandan coconut sticky rice topped with toasted sesame seeds.',
        price: 10,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'caterer_7',
    name: 'Taj Spice Palace',
    category: 'caterer',
    cuisine: 'Indian',
    pricePerGuest: 35,
    minGuests: 15,
    rating: 4.9,
    ratingCount: 210,
    description: 'Royal Indian wedding and grand event catering featuring live clay tandoori grills, velvety butter chicken, garlic butter naan baskets, saffron biryanis, and warm gulab jamun.',
    imageUrls: [
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 40,
    pricingNotes: 'Includes live Tandoor oven setup for fresh piping hot naan breads.',
    customMenuSupported: true,
    weekendRatePercentage: 15,
    blockedDates: [],
    workingHours: { start: '11:00', end: '23:00' },
    locationName: 'Metro South & Suburbs',
    menuItems: [
      {
        id: 'c7_m1',
        name: 'Saffron Lamb Dum Biryani Platter',
        description: 'Aromatic basmati rice layered with slow-cooked marinated lamb shank, saffron strands, fried onions, and mint raita.',
        price: 28,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c7_m2',
        name: 'Live Tandoori Garlic Naan Baskets',
        description: 'Fresh leavened flatbread baked in clay tandoor, brushed with organic ghee and roasted garlic (Set of 10).',
        price: 18,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c7_m3',
        name: 'Warm Rosewater Gulab Jamun',
        description: 'Golden milk solid dumplings fried and soaked in cardamom rose syrup, garnished with crushed pistachios.',
        price: 9,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'caterer_8',
    name: 'Island Spice Caribbean Kitchen',
    category: 'caterer',
    cuisine: 'Caribbean',
    pricePerGuest: 29,
    minGuests: 12,
    rating: 4.8,
    ratingCount: 102,
    description: 'Caribbean reggae fusion catering. Signature pimento-smoked jerk chicken platters, sweet fried plantains, slow-braised curry goat, coconut rice & peas, and dark rum cake.',
    imageUrls: [
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 25,
    pricingNotes: 'Complimentary tropical fruit punch bucket included for party bookings over 20 guests.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '12:00', end: '22:00' },
    locationName: 'East Coast & Beachside',
    menuItems: [
      {
        id: 'c8_m1',
        name: 'Pimento Smoked Jerk Chicken Feast',
        description: 'Scotch bonnet and island spice marinated chicken smoked over pimento wood, served with rice & peas and sweet plantains.',
        price: 24,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c8_m2',
        name: 'Golden Sweet Fried Plantain Bites',
        description: 'Ripe yellow plantains fried golden caramel brown with sea salt and guava glaze (Serves 8).',
        price: 12,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c8_m3',
        name: 'Aged Jamaican Dark Rum Cake',
        description: 'Rich fruit cake infused with spiced dark rum and butter glaze.',
        price: 11,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'caterer_9',
    name: 'Barcelona Tapas & Paella',
    category: 'caterer',
    cuisine: 'Spanish',
    pricePerGuest: 42,
    minGuests: 15,
    rating: 4.9,
    ratingCount: 156,
    description: 'Live outdoor giant paella pan show cooking and sangria bar. Serving authentic seafood paella, Jamón Ibérico croquetas, sizzling gambas al ajillo, and warm churros.',
    imageUrls: [
      'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 35,
    pricingNotes: 'Chef brings 4-foot outdoor steel paella burners for live cooking spectacles.',
    customMenuSupported: true,
    weekendRatePercentage: 15,
    blockedDates: [],
    workingHours: { start: '12:00', end: '23:00' },
    locationName: 'Metro Waterfront',
    menuItems: [
      {
        id: 'c9_m1',
        name: 'Live Seafood Paella Valenciana',
        description: 'Saffron bomba rice cooked with jumbo prawns, calamari, mussels, chorizo, and sweet Bell peppers.',
        price: 36,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c9_m2',
        name: 'Sizzling Garlic Gambas al Ajillo',
        description: 'Wild caught shrimp sautéed in Spanish olive oil, crushed garlic, dried red chilies, and served with crusty bread.',
        price: 20,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c9_m3',
        name: 'House Red Wine Sangria Pitcher (1.5L)',
        description: 'Spanish Rioja red wine macerated with fresh oranges, green apples, cinnamon, and brandy.',
        price: 35,
        category: 'Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'caterer_10',
    name: 'Saigon Lotus Vietnamese Bistro',
    category: 'caterer',
    cuisine: 'Vietnamese',
    pricePerGuest: 26,
    minGuests: 10,
    rating: 4.8,
    ratingCount: 88,
    description: 'Fresh Vietnamese banquet catering featuring mini banh mi slider platters, fresh rice paper spring rolls, lemongrass grilled pork vermicelli bowls, and condensed milk iced coffee.',
    imageUrls: [
      'https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583032015879-e50223beb67b?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 30,
    pricingNotes: 'Gluten-free and vegan spring roll options always available.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '10:30', end: '21:30' },
    locationName: 'North Chinatown & Suburbs',
    menuItems: [
      {
        id: 'c10_m1',
        name: 'Fresh Shrimp & Herb Summer Rolls',
        description: 'Rice paper rolls filled with poach tiger shrimp, vermicelli noodles, fresh mint, basil, and peanut dipping sauce (Set of 10).',
        price: 18,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c10_m2',
        name: 'Lemongrass Grilled Pork Banh Mi Sliders',
        description: 'Crispy French baguette mini rolls filled with charbroiled pork, pickled daikon carrots, cucumber, jalapeño, and pate (Set of 6).',
        price: 22,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c10_m3',
        name: 'Vietnamese Robusta Dripped Iced Coffee',
        description: 'Slow-dripped dark roast Vietnamese coffee sweetened with rich condensed milk over crushed ice (Serves 8).',
        price: 28,
        category: 'Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'caterer_11',
    name: 'Cedar & Olive Levantine Catering',
    category: 'caterer',
    cuisine: 'Middle Eastern',
    pricePerGuest: 31,
    minGuests: 12,
    rating: 4.9,
    ratingCount: 132,
    description: 'Levantine feast catering. Ultra-creamy hummus topped with sumac pine nuts, slow-roasted lamb shawarma platters, crispy falafel skewers, tabbouleh salads, and pistachio kunafa.',
    imageUrls: [
      'https://images.unsplash.com/photo-1579684947550-22e945225d9a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 35,
    pricingNotes: 'Halal certified meats used across all catering packages.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '10:00', end: '22:00' },
    locationName: 'West Valley & Heights',
    menuItems: [
      {
        id: 'c11_m1',
        name: 'Artisanal Meze Mezze Platter',
        description: 'Hummus, babaganoush, labneh with za\'atar, stuffed grape leaves, warm pita breads, and marinated olives.',
        price: 24,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c11_m2',
        name: 'Slow-Roasted Lamb Shawarma Feast',
        description: 'Spiced marinated lamb carved thin, served with garlic toum sauce, pickled turnip, and fragrant saffron rice.',
        price: 29,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c11_m3',
        name: 'Warm Pistachio Cheese Kunafa',
        description: 'Crispy shredded kataifi pastry layered with sweet akkawi cheese, scented sugar syrup, and crushed pistachios.',
        price: 12,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'caterer_12',
    name: 'Trattoria Nonna Rosa',
    category: 'caterer',
    cuisine: 'Italian',
    pricePerGuest: 34,
    minGuests: 10,
    rating: 4.8,
    ratingCount: 178,
    description: 'Traditional southern Italian family-style catering. Giant baked lasagnas, wood-fired rosemary focaccia, chicken valdocostana, caesar salad, and ricotta cannoli.',
    imageUrls: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 25,
    pricingNotes: 'Served in heavy insulated hot-catering pans ready for instant buffet display.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '11:00', end: '22:00' },
    locationName: 'Little Italy & Downtown',
    menuItems: [
      {
        id: 'c12_m1',
        name: 'Nonna\'s Classic 7-Layer Meat Lasagna',
        description: 'Slow-simmered bolognese sauce, fresh pasta sheets, creamy béchamel, and melted mozzarella (Full Pan serves 12).',
        price: 85,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c12_m2',
        name: 'Rosemary Sea Salt Focaccia Tray',
        description: 'House-baked thick Italian flatbread topped with fresh rosemary, extra virgin olive oil, and flaky sea salt.',
        price: 16,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'c12_m3',
        name: 'Sicilian Pistachio & Chocolate Chip Cannoli',
        description: 'Crispy fried pastry shells filled with sweet ricotta cream and dark chocolate chips (Set of 12).',
        price: 24,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },

  // --- 10 NEW FOOD TRUCKS ---
  {
    id: 'food_truck_3',
    name: 'Sizzle & Smash Burger Truck',
    category: 'food_truck',
    cuisine: 'American',
    pricePerGuest: 20,
    minGuests: 20,
    rating: 4.8,
    ratingCount: 195,
    description: 'High-octane smash burger truck serving double lacey-edge patties, jalapeno popper fries, bacon jam sliders, and cold craft lemonades directly from the window.',
    imageUrls: [
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 40,
    pricingNotes: 'Continuous fast window service for up to 100 guests per hour.',
    customMenuSupported: false,
    weekendRatePercentage: 15,
    blockedDates: [],
    workingHours: { start: '11:00', end: '24:00' },
    locationName: 'Greater Metro Area',
    menuItems: [
      {
        id: 'ft3_m1',
        name: 'Double Bacon Smash Burger',
        description: 'Two smashed Angus beef patties, thick smoked bacon, American cheese, grilled onions, and house sauce on brioche.',
        price: 15,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft3_m2',
        name: 'Jalapeño Queso Loaded Fries',
        description: 'Golden skin-on fries smothered in warm pepper jack cheese sauce, pickled jalapeños, and bacon crumbles.',
        price: 9,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft3_m3',
        name: 'Fresh Strawberry Mint Lemonade',
        description: 'Muddled fresh strawberries, lemon juice, and spearmint leaves over ice.',
        price: 6,
        category: 'Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'food_truck_4',
    name: 'Seoul Street K-BBQ Wheels',
    category: 'food_truck',
    cuisine: 'Korean',
    pricePerGuest: 24,
    minGuests: 15,
    rating: 4.9,
    ratingCount: 142,
    description: 'Korean street food truck with Bulgogi beef rice bowls, kimchi cheese fries, spicy sweet double-fried Korean chicken tenders, and taro boba milk teas.',
    imageUrls: [
      'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 35,
    pricingNotes: 'Halal chicken and vegetarian tofu bowl options included.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '12:00', end: '23:00' },
    locationName: 'University & Tech Hub',
    menuItems: [
      {
        id: 'ft4_m1',
        name: 'Marinated Beef Bulgogi Rice Bowl',
        description: 'Sweet soy sesame marinated ribeye, steamed rice, kimchi, fried egg, and toasted sesame seeds.',
        price: 17,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft4_m2',
        name: 'Gochujang Honey Glazed Chicken Tenders',
        description: 'Double-fried extra crispy chicken tenders tossed in sticky spicy gochujang honey glaze (Set of 5).',
        price: 14,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft4_m3',
        name: 'Taro Brown Sugar Boba Tea',
        description: 'Creamy taro milk tea with chewy brown sugar tapioca pearls over ice.',
        price: 7,
        category: 'Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'food_truck_5',
    name: 'Rolling Oven Wood-Fired Pizza',
    category: 'food_truck',
    cuisine: 'Italian',
    pricePerGuest: 25,
    minGuests: 20,
    rating: 4.9,
    ratingCount: 230,
    description: 'Custom trailer built with an authentic 900°F Italian brick wood oven. Baking fresh Neapolitan Margherita, Spicy Soppressata with Truffle Honey, and Garlic Knot bites in 90 seconds.',
    imageUrls: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 45,
    pricingNotes: 'Continuous live baking at your venue. Up to 60 pizzas per hour.',
    customMenuSupported: true,
    weekendRatePercentage: 15,
    blockedDates: [],
    workingHours: { start: '12:00', end: '23:00' },
    locationName: 'North Suburbs & Estates',
    menuItems: [
      {
        id: 'ft5_m1',
        name: 'Hot Honey Soppressata Pizza (12")',
        description: 'San Marzano tomato sauce, fresh fior di latte mozzarella, spicy calabrian soppressata, fresh basil, and hot honey drizzle.',
        price: 18,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft5_m2',
        name: 'Wood-Oven Garlic Butter Knots',
        description: 'Fresh dough knots tossed in roasted garlic oil, parmesan, and fresh parsley with marinara sauce (Set of 8).',
        price: 9,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft5_m3',
        name: 'Nutella Marshmallow Calzone Bite',
        description: 'Mini baked calzone filled with warm Nutella and melted marshmallows.',
        price: 8,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'food_truck_6',
    name: 'CrepemanIA Express',
    category: 'food_truck',
    cuisine: 'French',
    pricePerGuest: 19,
    minGuests: 15,
    rating: 4.7,
    ratingCount: 98,
    description: 'Sweet and savory French crepe truck. Live griddle flipping of savory ham & gruyère crepes, Nutella banana strawberry crepes, and warm cinnamon sugar butter galettes.',
    imageUrls: [
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 30,
    pricingNotes: 'Great for brunch parties, birthday dessert stations, and late-night wedding treats.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '09:00', end: '22:00' },
    locationName: 'Central Parks & Downtown',
    menuItems: [
      {
        id: 'ft6_m1',
        name: 'Nutella Banana Strawberry Crepe',
        description: 'Fresh warm French crepe filled with generous Nutella, sliced strawberries, bananas, and whipped cream.',
        price: 12,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft6_m2',
        name: 'Parisian Ham & Gruyère Savory Crepe',
        description: 'Buckwheat flour crepe filled with smoked ham, aged melted Gruyère cheese, and a fried egg.',
        price: 15,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft6_m3',
        name: 'French Press Dark Roast Coffee',
        description: 'Freshly brewed single-origin French roast coffee (Serves 1).',
        price: 4,
        category: 'Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'food_truck_7',
    name: 'Coastal Crust & Lobster Roll Co.',
    category: 'food_truck',
    cuisine: 'Seafood',
    pricePerGuest: 38,
    minGuests: 15,
    rating: 4.9,
    ratingCount: 167,
    description: 'Maine lobster roll truck serving warm butter-drenched lobster rolls, crispy New England clam chowder shots, fried calamari, and blueberry lemonades.',
    imageUrls: [
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 35,
    pricingNotes: '100% real wild-caught Maine lobster meat shipped fresh.',
    customMenuSupported: false,
    weekendRatePercentage: 15,
    blockedDates: [],
    workingHours: { start: '11:30', end: '22:00' },
    locationName: 'Beachside & Marina',
    menuItems: [
      {
        id: 'ft7_m1',
        name: 'Connecticut Warm Butter Lobster Roll',
        description: 'Fresh lobster claw and tail meat drenched in warm clarified butter on a toasted split-top brioche bun with Old Bay fries.',
        price: 28,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft7_m2',
        name: 'New England Clam Chowder Cup',
        description: 'Rich creamy chowder filled with tender clams, diced potatoes, and smoked bacon with oyster crackers.',
        price: 10,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft7_m3',
        name: 'Wild Maine Blueberry Iced Tea',
        description: 'Freshly brewed black iced tea lightly sweetened with organic Maine blueberry syrup.',
        price: 5,
        category: 'Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'food_truck_8',
    name: 'El Fuego Burrito Truck',
    category: 'food_truck',
    cuisine: 'Mexican',
    pricePerGuest: 21,
    minGuests: 15,
    rating: 4.8,
    ratingCount: 114,
    description: 'Mega-burritos, crispy birria quesatacos with rich beef consommé dipping broth, loaded nacho boxes, and hand-shaken horchata smoothies.',
    imageUrls: [
      'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 30,
    pricingNotes: 'Salsa bar with 5 spicy house salsas provided free with every booking.',
    customMenuSupported: false,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '11:00', end: '24:00' },
    locationName: 'South District',
    menuItems: [
      {
        id: 'ft8_m1',
        name: 'Cheesy Birria Quesatacos (3 Pcs)',
        description: 'Crispy corn tortillas dipped in chili oil, stuffed with melted Oaxaca cheese and slow-cooked shredded beef birria, served with warm consommé.',
        price: 16,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft8_m2',
        name: 'Cali Surf & Turf Burrito',
        description: 'Grilled carne asada steak, garlic shrimp, crispy french fries, guacamole, and chipotle crema wrapped in a giant flour tortilla.',
        price: 18,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft8_m3',
        name: 'Cinnamon Rice Horchata Agua Fresca',
        description: 'Traditional Mexican sweet rice milk with cinnamon and vanilla over ice.',
        price: 5,
        category: 'Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'food_truck_9',
    name: 'Sugar Rush Churro & Donut Van',
    category: 'food_truck',
    cuisine: 'Desserts',
    pricePerGuest: 16,
    minGuests: 20,
    rating: 4.9,
    ratingCount: 205,
    description: 'Hot fresh churro loops, gourmet glaze donut rings, warm Belgian waffle sticks with warm chocolate syringes, and handcrafted espresso drinks.',
    imageUrls: [
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 35,
    pricingNotes: 'Huge favorite for birthday parties, weddings, and corporate dessert breaks.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '14:00', end: '24:00' },
    locationName: 'Metro & Suburbs',
    menuItems: [
      {
        id: 'ft9_m1',
        name: 'Stuffed Dulce de Leche Churro Loops',
        description: 'Crispy fried cinnamon sugar churro loops filled with warm dulce de leche caramel (Set of 6).',
        price: 10,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft9_m2',
        name: 'Belgian Waffle Stick Box',
        description: 'Crispy waffle sticks topped with crushed Oreos, sliced strawberries, and warm Nutella squeeze.',
        price: 12,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft9_m3',
        name: 'Iced Caramel Macchiato',
        description: 'Double shot espresso, cold milk, vanilla syrup, and buttery caramel drizzle.',
        price: 6,
        category: 'Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'food_truck_10',
    name: 'Arepa Express Street Eats',
    category: 'food_truck',
    cuisine: 'Flexible', // Venezuelan / Latin Street Food
    pricePerGuest: 22,
    minGuests: 15,
    rating: 4.8,
    ratingCount: 77,
    description: 'Handcrafted 100% gluten-free corn arepas stuffed with shredded beef, sweet plantains, melted queso guayanés, roasted pork, and homemade garlic cilantro sauce.',
    imageUrls: [
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 25,
    pricingNotes: 'Naturally 100% gluten-free grilled corn cake menu.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '11:00', end: '22:00' },
    locationName: 'West End',
    menuItems: [
      {
        id: 'ft10_m1',
        name: 'Pabellón Criollo Arepa',
        description: 'Grilled corn cake stuffed with shredded beef, black beans, sweet fried plantains, and white queso fresco.',
        price: 14,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft10_m2',
        name: 'Crispy Cheese Tequeños (6 Pcs)',
        description: 'Fried white cheese spear pastries wrapped in tender dough, served with green guasacaca sauce.',
        price: 10,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft10_m3',
        name: 'Passion Fruit Parchita Juice',
        description: 'Fresh blended tropical passion fruit juice over crushed ice.',
        price: 5,
        category: 'Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'food_truck_11',
    name: 'The Golden Crescent Gyro Truck',
    category: 'food_truck',
    cuisine: 'Mediterranean',
    pricePerGuest: 22,
    minGuests: 15,
    rating: 4.8,
    ratingCount: 160,
    description: 'Authentic 100% Halal lamb & chicken gyro wraps, loaded tzatziki feta fries, crispy falafel pita pockets, and walnut baklava bites.',
    imageUrls: [
      'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 30,
    pricingNotes: 'Halal certified with fast service directly from the window.',
    customMenuSupported: false,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '11:00', end: '24:00' },
    locationName: 'North Metro & Downtown',
    menuItems: [
      {
        id: 'ft11_m1',
        name: 'Supreme Lamb & Beef Gyro Wrap',
        description: 'Warm fluffy pita stuffed with seasoned carved lamb & beef, tomatoes, red onions, and cucumber tzatziki.',
        price: 15,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft11_m2',
        name: 'Loaded Greek Feta & Garlic Fries',
        description: 'Crispy fries tossed in oregano salt, crumbled Greek feta, garlic sauce, and chopped parsley.',
        price: 8,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft11_m3',
        name: 'Pistachio Baklava Bite Pack',
        description: 'Phyllo pastry diamonds layered with honey and crushed pistachios (Pack of 3).',
        price: 6,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'food_truck_12',
    name: 'Bao Boyz Steamed Bun Truck',
    category: 'food_truck',
    cuisine: 'Asian',
    pricePerGuest: 23,
    minGuests: 15,
    rating: 4.9,
    ratingCount: 182,
    description: 'Fluffy Asian steamed bao buns stuffed with slow-braised pork belly, roasted hoisin duck, crispy chili tofu, and spicy Szechuan pepper fries.',
    imageUrls: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 35,
    pricingNotes: 'Custom bao combinations for all event sizes.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '12:00', end: '23:00' },
    locationName: 'Arts & Cultural District',
    menuItems: [
      {
        id: 'ft12_m1',
        name: 'Braised Pork Belly Bao Trio',
        description: 'Three pillow-soft white lotus bao buns packed with 12-hour braised pork belly, crushed peanuts, pickled mustard greens, and cilantro.',
        price: 16,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft12_m2',
        name: 'Crispy Szechuan Pepper Fries',
        description: 'Skinny fries tossed in toasted Szechuan peppercorns, sea salt, garlic, and sweet chili mayo dip.',
        price: 8,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ft12_m3',
        name: 'Iced Thai Milk Tea with Grass Jelly',
        description: 'Aromatic brewed Thai red tea sweetened with milk and herbal grass jelly cubes.',
        price: 6,
        category: 'Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },

  // --- 10 NEW PRIVATE CHEFS ---
  {
    id: 'chef_3',
    name: 'Chef Kenji Takahashi',
    category: 'private_chef',
    cuisine: 'Japanese',
    pricePerGuest: 135,
    minGuests: 4,
    rating: 5.0,
    ratingCount: 88,
    description: 'Master Chef Kenji Takahashi brings authentic Edomae sushi omakase and A5 Miyazaki Wagyu table grilling to your residence. Experience rare seasonal catches, hand-grated wasabi, and traditional Japanese hospitality.',
    imageUrls: [
      'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 30,
    pricingNotes: 'Includes high-end Japanese tableware setup, cypress wood boards, and complete kitchen clean.',
    customMenuSupported: true,
    weekendRatePercentage: 15,
    blockedDates: [],
    workingHours: { start: '17:00', end: '23:00' },
    locationName: 'Oceanfront & North Hills',
    menuItems: [
      {
        id: 'ch3_m1',
        name: 'A5 Miyazaki Wagyu Beef Tataki',
        description: 'Lightly seared A5 Wagyu beef slices with ponzu gelee, garlic chips, and micro shiso.',
        price: 45,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch3_m2',
        name: 'Private 8-Course Omakase Nigiri Experience',
        description: 'Otoro, Chutoro, Uni from Hokkaido, Botan Ebi, Akami, and Anago served piece-by-piece at your dining table.',
        price: 135,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch3_m3',
        name: 'Uji Matcha Parfait with Azuki Beans',
        description: 'Layered green tea jelly, matcha soft gelato, sweet red bean paste, and gold leaf.',
        price: 18,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'chef_4',
    name: 'Chef Amara Okafor',
    category: 'private_chef',
    cuisine: 'African',
    pricePerGuest: 85,
    minGuests: 6,
    rating: 4.9,
    ratingCount: 64,
    description: 'High-end West African gastronomy. Suya spiced lamb chops, smoked jollof arancini balls with truffles, grilled king prawns in scotch bonnet butter, and coconut cassava pudding.',
    imageUrls: [
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 25,
    pricingNotes: 'Custom spicy or mild level options tailored to your preference.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '16:00', end: '22:00' },
    locationName: 'Downtown & Metro East',
    menuItems: [
      {
        id: 'ch4_m1',
        name: 'Truffle Smoked Jollof Arancini',
        description: 'Crispy fried rice spheres infused with smoked bell pepper reduction, goat cheese, and white truffle oil.',
        price: 18,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch4_m2',
        name: 'Suya Crusted Colorado Lamb Chops',
        description: 'Grilled rack of lamb coated in peanut suya spice blend, served with roasted plantain puree and wild greens.',
        price: 48,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch4_m3',
        name: 'Warm Coconut Cassava Cake',
        description: 'Rich baked cassava cake with caramelized coconut syrup and vanilla bean gelato.',
        price: 14,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'chef_5',
    name: 'Chef Pierre Laurent',
    category: 'private_chef',
    cuisine: 'French',
    pricePerGuest: 110,
    minGuests: 4,
    rating: 5.0,
    ratingCount: 94,
    description: 'Classical French fine dining chef with experience in Michelin 3-star Parisian kitchens. Pan-seared foie gras, duck breast à l’orange, Dover sole meunière, and Grand Marnier soufflés.',
    imageUrls: [
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 35,
    pricingNotes: 'Sommelier wine pairings provided for every course upon request.',
    customMenuSupported: true,
    weekendRatePercentage: 15,
    blockedDates: [],
    workingHours: { start: '17:00', end: '23:00' },
    locationName: 'Luxury Coastal Belt',
    menuItems: [
      {
        id: 'ch5_m1',
        name: 'Pan-Seared Hudson Valley Foie Gras',
        description: 'Seared duck foie gras served over brioche toast with caramelized fig compote and aged balsamic.',
        price: 28,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch5_m2',
        name: 'Crispy Skin Duck Breast à l’Orange',
        description: 'Pan-roasted Moulard duck breast with blood orange reduction, fondant potatoes, and glazed baby carrots.',
        price: 46,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch5_m3',
        name: 'Warm Grand Marnier Orange Soufflé',
        description: 'Puffed light egg white soufflé laced with Grand Marnier liqueur, served fresh from your oven.',
        price: 18,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'chef_6',
    name: 'Chef Isabella Rossi',
    category: 'private_chef',
    cuisine: 'Italian',
    pricePerGuest: 90,
    minGuests: 4,
    rating: 4.9,
    ratingCount: 120,
    description: 'Tuscan pasta master and truffle specialist. Hand-shaped agnolotti del plin, wild boar ragù, creamy saffron risotto with lobster, and limoncello panna cotta.',
    imageUrls: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 25,
    pricingNotes: 'Includes live pasta rolling demonstration at your kitchen counter!',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '16:30', end: '22:30' },
    locationName: 'North Hills & Metro',
    menuItems: [
      {
        id: 'ch6_m1',
        name: 'Hand-Rolled Agnolotti del Plin',
        description: 'Piedmontese mini pinched pasta filled with veal and fontina cheese, tossed in sage brown butter sauce.',
        price: 32,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch6_m2',
        name: 'Saffron & Butter Roasted Lobster Risotto',
        description: 'Carnaroli rice simmered in lobster shell broth with Iranian saffron strands and Maine lobster tail butter.',
        price: 48,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch6_m3',
        name: 'Amalfi Coast Limoncello Panna Cotta',
        description: 'Silky cooked cream infused with organic lemon zest and house-made limoncello reduction.',
        price: 14,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'chef_7',
    name: 'Chef Diego Fernandez',
    category: 'private_chef',
    cuisine: 'Mexican',
    pricePerGuest: 80,
    minGuests: 6,
    rating: 4.9,
    ratingCount: 79,
    description: 'Modern Mexican haute cuisine. Duck carnitas in 30-ingredient mole negro, char-grilled mezcal octopus, sweet corn esquites with smoked bone marrow, and churro soufflé.',
    imageUrls: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 30,
    pricingNotes: 'Mezcal and tequila pairing flights available.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '17:00', end: '23:00' },
    locationName: 'South End & Beach',
    menuItems: [
      {
        id: 'ch7_m1',
        name: 'Char-Grilled Mezcal Glazed Octopus',
        description: 'Pacific octopus charred over wood fire, brushed with mezcal guajillo glaze and white bean puree.',
        price: 26,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch7_m2',
        name: 'Confit Duck Breast in Oaxacan Mole Negro',
        description: 'Crispy skin duck breast served over artisanal 30-ingredient dark chocolate mole with heirloom corn tortillas.',
        price: 42,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch7_m3',
        name: 'Warm Cinnamon Churro Soufflé',
        description: 'Fluffy cajeta caramel filled dessert served with spiced Mexican hot chocolate sauce.',
        price: 15,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'chef_8',
    name: 'Chef Maya Lin',
    category: 'private_chef',
    cuisine: 'Asian',
    pricePerGuest: 95,
    minGuests: 6,
    rating: 4.9,
    ratingCount: 110,
    description: 'Pan-Asian luxury tasting menus. Hand-folded lobster har gow dim sum, Peking duck steamed crepes, miso glazed black cod, and chilled mango sago pomelo dessert.',
    imageUrls: [
      'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 30,
    pricingNotes: 'Bespoke multi-course Asian banquet served on porcelain dinnerware.',
    customMenuSupported: true,
    weekendRatePercentage: 15,
    blockedDates: [],
    workingHours: { start: '16:00', end: '22:00' },
    locationName: 'Central District',
    menuItems: [
      {
        id: 'ch8_m1',
        name: 'Lobster & Truffle Har Gow Dim Sum',
        description: 'Translucent steamed crystal dumplings stuffed with Maine lobster tail and black truffle shavings (Set of 4).',
        price: 24,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch8_m2',
        name: 'Saikyo Miso Glazed Alaskan Black Cod',
        description: 'Wild Alaskan black cod marinated for 72 hours in sweet white miso, broiled caramelized perfection with hajikami ginger.',
        price: 45,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch8_m3',
        name: 'Chilled Mango Sago Pomelo Soup',
        description: 'Fresh mango nectar puree with coconut milk, tapioca pearls, and fresh pomelo citrus sacs.',
        price: 12,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'chef_9',
    name: 'Chef Mateus Silva',
    category: 'private_chef',
    cuisine: 'Flexible', // Brazilian Churrasco
    pricePerGuest: 88,
    minGuests: 8,
    rating: 5.0,
    ratingCount: 135,
    description: 'Brazilian Churrasco Rodizio experience in your own backyard. Skewer-carved Picanha prime steak, bacon-wrapped filet mignon, cinnamon roasted pineapple, and fresh caipirinhas.',
    imageUrls: [
      'https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 40,
    pricingNotes: 'Chef brings charcoal skewer grill station and table carving swords.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '12:00', end: '22:00' },
    locationName: 'Metro Suburbs & Country Estates',
    menuItems: [
      {
        id: 'ch9_m1',
        name: 'Tableside Carved Picanha Prime Steak',
        description: 'Top sirloin cap seasoned with coarse sea salt, grilled over open charcoal flames and carved thin at your table.',
        price: 42,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch9_m2',
        name: 'Warm Pão de Queijo Cheese Bread',
        description: 'Traditional gluten-free Brazilian tapioca cheese rolls served warm (Basket of 12).',
        price: 14,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch9_m3',
        name: 'Cinnamon Brown Sugar Roasted Pineapple',
        description: 'Whole skewer pineapple glazed with dark brown sugar and cinnamon, carved hot off the grill.',
        price: 10,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'chef_10',
    name: 'Chef Elena Vassiliou',
    category: 'private_chef',
    cuisine: 'Greek',
    pricePerGuest: 92,
    minGuests: 4,
    rating: 4.9,
    ratingCount: 82,
    description: 'Aegean seafood & Mediterranean luxury dining. Sea bass baked in sea salt crust, grilled jumbo tiger prawns in lemon herb oil, Greek salad with barrel-aged feta, and galaktoboureko.',
    imageUrls: [
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 30,
    pricingNotes: 'Fresh daily catches sourced directly from local fish markets.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '16:00', end: '22:00' },
    locationName: 'Harbor & Beachfront',
    menuItems: [
      {
        id: 'ch10_m1',
        name: 'Salt-Crust Cracked Wild Mediterranean Sea Bass',
        description: 'Whole wild sea bass encased in sea salt dough crust, cracked open tableside and drizzled with Ladolemono olive oil.',
        price: 48,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch10_m2',
        name: 'Grilled Jumbo Tiger Prawns in Oregano Oil',
        description: 'Wild prawns charred with lemon, Greek oregano, sea salt, and extra virgin Kalamata olive oil.',
        price: 28,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch10_m3',
        name: 'Crispy Warm Galaktoboureko Custard',
        description: 'Golden phyllo pastry pie filled with warm semolina custard and scented citrus honey syrup.',
        price: 14,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'chef_11',
    name: 'Chef Liam O’Connor',
    category: 'private_chef',
    cuisine: 'American',
    pricePerGuest: 105,
    minGuests: 4,
    rating: 5.0,
    ratingCount: 140,
    description: 'Heritage steakhouse & artisanal wood grill specialist. 45-day dry-aged Tomahawk ribeyes, roasted smoked bone marrow with shallot jam, loaded twice-baked potatoes, and bourbon pecan pie.',
    imageUrls: [
      'https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 35,
    pricingNotes: 'Prime beef sourced from heritage pasture farms.',
    customMenuSupported: true,
    weekendRatePercentage: 15,
    blockedDates: [],
    workingHours: { start: '16:00', end: '22:30' },
    locationName: 'North Suburbs & Estates',
    menuItems: [
      {
        id: 'ch11_m1',
        name: 'Roasted Smoked Bone Marrow & Shallot Jam',
        description: 'Canoe-cut beef bone marrow roasted with garlic herbs, served with sweet shallot jam and toasted sourdough.',
        price: 24,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch11_m2',
        name: '45-Day Dry-Aged Prime Tomahawk Steak',
        description: '32oz bone-in dry-aged ribeye seared over oak wood, served with smoked bone marrow butter and red wine reduction.',
        price: 65,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch11_m3',
        name: 'Warm Bourbon Pecan Pie with Vanilla Ice Cream',
        description: 'Classic southern pecan pie infused with Kentucky bourbon, topped with Madagascar vanilla gelato.',
        price: 14,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'chef_12',
    name: 'Chef Priya Sharma',
    category: 'private_chef',
    cuisine: 'Indian',
    pricePerGuest: 85,
    minGuests: 6,
    rating: 4.9,
    ratingCount: 72,
    description: 'Royal Awadhi & Progressive Indian culinary master. Saffron lamb biryani, paneer tikka skewers with mint chutney, truffle butter naan, and cardamom pistachio kulfi pops.',
    imageUrls: [
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80'
    ],
    maxRadius: 30,
    pricingNotes: 'Full vegetarian, vegan, and Jain menu variations available upon request.',
    customMenuSupported: true,
    weekendRatePercentage: 10,
    blockedDates: [],
    workingHours: { start: '16:00', end: '22:00' },
    locationName: 'South & Metro West',
    menuItems: [
      {
        id: 'ch12_m1',
        name: 'Truffle Mushroom Galouti Kebabs',
        description: 'Melt-in-your-mouth spiced mushroom patties infused with black truffle oil, served on mini saffron parathas.',
        price: 20,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch12_m2',
        name: 'Royal Lamb Shank Awadhi Korma',
        description: 'Slow-braised lamb shank in rich cashew saffron gravy with kewra water and truffle garlic naan.',
        price: 42,
        category: 'Mains',
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch12_m3',
        name: 'Cardamom Pistachio Kulfi Pops',
        description: 'Traditional slow-cooked Indian ice cream with saffron, green cardamom, and crushed pistachios.',
        price: 12,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
      }
    ]
  }
];

export const INITIAL_USER: UserAccount = {
  name: 'Kieran Nelson',
  phone: '+1 (555) 489-3210',
  email: 'kierannelson120@gmail.com',
  savedAddresses: [
    '242 Ocean Drive, Apt 4B, South Beach, FL',
    '890 Pine Valley Lane, Miami, FL'
  ],
  savedPayments: [
    {
      id: 'pay_1',
      brand: 'ApplePay',
      last4: '4832',
      expiry: '12/28',
      isDefault: true
    },
    {
      id: 'pay_2',
      brand: 'Visa',
      last4: '0981',
      expiry: '04/29',
      isDefault: false
    }
  ]
};

export const INITIAL_CHATS: ChatThread[] = [
  {
    id: 'chef_1',
    vendorId: 'chef_1',
    vendorName: "Chef Marco Rossi",
    vendorImageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100&auto=format&fit=crop&q=80',
    unreadCount: 1,
    lastMessageTime: '2026-07-19T18:30:00-07:00',
    messages: [
      {
        id: 'm1_1',
        sender: 'user',
        text: 'Hello Chef Marco! I am planning a small birthday dinner for my husband in 2 weeks. Can you do a gluten-free menu for 6 people?',
        timestamp: '2026-07-19T18:15:00-07:00'
      },
      {
        id: 'm1_2',
        sender: 'vendor',
        text: 'Ciao Kieran! Che bello! Yes, absolutely. I can substitute the Tagliolini with a handmade gluten-free chickpea flour gnocchi or gluten-free pasta. Would that work?',
        timestamp: '2026-07-19T18:22:00-07:00'
      },
      {
        id: 'm1_3',
        sender: 'user',
        text: 'That sounds perfect! What about the dessert?',
        timestamp: '2026-07-19T18:25:00-07:00'
      },
      {
        id: 'm1_4',
        sender: 'vendor',
        text: 'For dessert, I can make a flourless chocolate caprese cake served with fresh wild berries and raspberry coulis. Let me send you a custom quote for the 6-guest gluten-free birthday package!',
        timestamp: '2026-07-19T18:30:00-07:00'
      }
    ]
  },
  {
    id: 'chef_2',
    vendorId: 'chef_2',
    vendorName: "Chef Sarah Lin",
    vendorImageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&auto=format&fit=crop&q=80',
    unreadCount: 0,
    lastMessageTime: '2026-07-19T14:10:00-07:00',
    messages: [
      {
        id: 'm2_1',
        sender: 'user',
        text: 'Hi Sarah, can we build a fusion menu combining French seafood with Japanese plating?',
        timestamp: '2026-07-19T13:45:00-07:00'
      },
      {
        id: 'm2_2',
        sender: 'vendor',
        text: 'Hi Kieran! That is my favorite style. I can create a custom 5-course menu: Yuzu butter seared scallops, Miso-glazed sea bass, beef tenderloin with wasabi au poivre, and matcha soufflé.',
        timestamp: '2026-07-19T14:02:00-07:00'
      },
      {
        id: 'm2_3',
        sender: 'vendor',
        text: 'I\'ve created a Custom Menu Request for you. Here is the custom digital quote!',
        timestamp: '2026-07-19T14:10:00-07:00',
        customQuote: {
          title: 'French-Japanese Fusion (6 Guests)',
          amount: 720,
          items: [
            'Appetizer: Yuzu Butter Hokkaido Scallops',
            'Mid: Black Cod with Shiro Miso & Asparagus',
            'Main: Prime Beef Tenderloin w/ Wasabi Au Poivre',
            'Dessert: Warm Matcha Soufflé & Sesame Gelato',
            'Service: Plating, dedicated prep, & cleanup'
          ]
        }
      }
    ]
  },
  {
    id: 'caterer_1',
    vendorId: 'caterer_1',
    vendorName: 'Gourmet Garden Caterers',
    vendorImageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=100&auto=format&fit=crop&q=80',
    unreadCount: 0,
    lastMessageTime: '2026-07-18T16:45:00-07:00',
    messages: [
      {
        id: 'm3_1',
        sender: 'user',
        text: 'Hi! We are looking to book your farm-to-table catering for an outdoor cocktail party of 30 guests. Do you provide staff for serving?',
        timestamp: '2026-07-18T16:30:00-07:00'
      },
      {
        id: 'm3_2',
        sender: 'vendor',
        text: 'Hello Kieran! Yes, absolutely. Our standard booking package includes two professional servers and a station manager to set up the grazing tables and ensure smooth service. We handle all cleanup as well!',
        timestamp: '2026-07-18T16:45:00-07:00'
      }
    ]
  },
  {
    id: 'food_truck_1',
    vendorId: 'food_truck_1',
    vendorName: 'Slide & Bite Burger Co.',
    vendorImageUrl: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=100&auto=format&fit=crop&q=80',
    unreadCount: 0,
    lastMessageTime: '2026-07-17T11:20:00-07:00',
    messages: [
      {
        id: 'm4_1',
        sender: 'user',
        text: 'Hi there! I am interested in booking your slider truck for a neighborhood block party. What are the vehicle dimensions? We have a somewhat narrow driveway.',
        timestamp: '2026-07-17T11:05:00-07:00'
      },
      {
        id: 'm4_2',
        sender: 'vendor',
        text: 'Hey Kieran! Our classic chrome truck is 24 feet long and 8.5 feet wide. As long as you have about 10 feet of vertical clearance and a flat surface to park, we should fit perfectly and be ready to serve!',
        timestamp: '2026-07-17T11:20:00-07:00'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif_1',
    title: 'Chef Marco sent a message',
    body: '"Let me send you a custom quote for the 6-guest gluten-free birthday package!"',
    timestamp: '2026-07-19T18:30:00-07:00',
    category: 'message',
    isRead: false
  },
  {
    id: 'notif_2',
    title: 'Booking Confirmed!',
    body: 'Your catering event with Fiesta Brava Catering on Aug 15 is locked in!',
    timestamp: '2026-07-18T10:00:00-07:00',
    category: 'booking',
    isRead: true
  }
];
