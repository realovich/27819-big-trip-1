import {getRandomArrayElement, getRandomInteger} from '../utils/common';

const destinations = ['Amsterdam', 'Chamonix', 'Geneva', 'Paris', 'Tallinn'];

const destinationDescriptions = ['Nestled along shimmering water canals, this city amazes with its architectural elegance and rich cultural scene, where every corner is infused with grand historical influences.', 'Surrounded by majestic mountains and emerald meadows, this small town captivates with its pastoral charm and friendly atmosphere, as if crafted for a tranquil life amidst nature.', 'Bustling streets filled with a variety of vibrant signs and aromas of diverse cuisine characterize this metropolis as a global hub of entertainment and culinary discoveries.', 'Weathered stone walls and narrow alleys of this ancient city are filled with historical mysteries, and the atmosphere of old-world romance attracts travelers from various corners of the globe.', 'Amidst towering skyscrapers and modern architecture, this city embodies the spirit of innovation and technological progress, offering a breathtaking glimpse into the future.'];

const generatePictureSource = () => `https://loremflickr.com/248/152?random=${getRandomInteger(8, 160)}`;

const destinationPictureAltTexts = ['The sun is shining brightly.', 'She loves reading books.', 'The cat sits on the mat.', 'We are going on a trip.', 'I enjoy listening to music.', 'Fresh coffee smells amazing.', 'He runs faster than her.', 'They celebrated their victory.'];

const generatePicturesArray = () => Array.from({length: getRandomInteger(0, 5)}, () => ({
  src: generatePictureSource(),
  alt: getRandomArrayElement(destinationPictureAltTexts)
}));

const generateDestinations = destinations.map((destination) => ({
  name: destination,
  description: getRandomArrayElement(destinationDescriptions),
  pictures: generatePicturesArray()
}));

export {generateDestinations};
