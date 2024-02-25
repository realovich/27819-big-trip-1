const generatePointOffers = (array, type) => {

  const offersObject = array.find((element) => element.type === type);
  const shuffledQuantity = getRandomInteger(0, array.length - 1);

  if (offersObject) {
    return offersObject.offers.slice(0, shuffledQuantity);
  }

  return [];
};

const generateOffers = () => {
  const offers = [
    {
      type: 'taxi',
      offers: [
        {
          title: 'Order City Mobil',
          price: 15,
        }, {
          title: 'Order Uber',
          price: 20,
        }, {
          title: 'Order Yandex Taxi',
          price: 20,
        }, {
          title: 'Order Business Class',
          price: 30,
        },
      ],
    }, {
      type: 'flight',
      offers: [
        {
          title: 'Choose seats',
          price: 5,
        }, {
          title: 'Add meal',
          price: 20,
        }, {
          title: 'Switch to comfort class',
          price: 50,
        },
      ],
    }, {
      type: 'check-in',
      offers: [
        {
          title: 'Add breakfast',
          price: 5,
        }, {
          title: 'Add luggage',
          price: 10,
        }, {
          title: 'Mini bar',
          price: 20,
        }, {
          title: 'Cable TV',
          price: 25,
        }, {
          title: 'Wi-Fi',
          price: 30,
        },
      ],
    }, {
      type: 'drive',
      offers: [
        {
          title: 'Order carsharing',
          price: 20,
        }, {
          title: 'Hire a driver',
          price: 20,
        },
      ],
    },
  ];

  offers.forEach((element) => {
    element.offers.forEach((innerElement) => {
      const {title, price} = innerElement;
      const shortname = title.split(' ').join('') + price;

      innerElement['shortname'] = shortname.toLocaleLowerCase();
    });
  });

  return offers;
};
