import { Property, PromoBanner } from './types';

export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Alakol Lake Resort',
    location: 'Alakol, Kazakhstan',
    price: 15000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    type: 'Resort',
  },
  {
    id: '2',
    name: 'Shymbulak Mountain Hotel',
    location: 'Almaty, Kazakhstan',
    price: 25000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    type: 'Hotel',
  },
  {
    id: '3',
    name: 'Caspian Sea Villa',
    location: 'Aktau, Kazakhstan',
    price: 30000,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    type: 'Villa',
  },
  {
    id: '4',
    name: 'Borovoe Resort & Spa',
    location: 'Burabay, Kazakhstan',
    price: 20000,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
    type: 'Resort',
  },
];

export const promoBanners: PromoBanner[] = [
  {
    id: '1',
    title: 'Summer Special',
    subtitle: 'Book now and save big',
    discount: '30% OFF',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
  },
  {
    id: '2',
    title: 'Weekend Getaway',
    subtitle: 'Perfect for quick trips',
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
  },
  {
    id: '3',
    title: 'Luxury Stays',
    subtitle: 'Premium resorts on sale',
    discount: '40% OFF',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
  },
];

export const categories = [
  { key: 'all', label: 'All' },
  { key: 'RESORT', label: 'Resorts' },
  { key: 'HOTEL', label: 'Hotels' },
  { key: 'VILLA', label: 'Villas' },
  { key: 'APARTMENT', label: 'Apartments' },
];

export const majorCities = ['Астана', 'Алматы', 'Шымкент'];
export const otherCities = [
  'Абай', 'Актау', 'Актобе', 'Алматинская область', 'Аркалык', 'Арыс', 'Атырау', 
  'Байконур', 'Балхаш', 'Батыр', 'Бейнеу', 'Боровое', 'Ерейментау', 'Есик', 'Есиль', 
  'Жанаозен', 'Жаркент', 'Жезказган', 'Кабанбай', 'Капчагай', 'Караганда', 'Каскелен', 
  'Кентау', 'Кокшетау', 'Конаев', 'Костанай', 'Кульсары', 'Курчатов', 'Кызылорда', 
  'Лисаковск', 'Макинск', 'Мерке', 'Орал', 'Оскемен', 'Павлодар', 'Петропавл', 
  'Риддер', 'Сарань', 'Сатпаев', 'Семей', 'Степногорск', 'Степняк', 'Талгар', 
  'Талдыкорган', 'Тараз', 'Темиртау', 'Туркестан', 'Уральск', 'Усть-Каменогорск', 
  'Чемолган', 'Шахтинск', 'Шу', 'Ынтымак'
].sort((a, b) => a.localeCompare(b));
