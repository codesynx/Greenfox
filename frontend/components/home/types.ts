import { PromoResponse } from '../../services/promoService';

export interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  type: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  image: string;
  data: PromoResponse;
}
