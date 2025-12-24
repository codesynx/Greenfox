/**
 * Common amenities configuration for admin panel and mobile app
 * Icons reference: iconsax-react-native library
 */

export interface Amenity {
  id: string;
  key: string;
  label: string;
  icon: string; // Icon name from iconsax-react-native
  category: 'essentials' | 'facilities' | 'dining' | 'wellness' | 'outdoor' | 'services';
}

export const AMENITIES_LIST: Amenity[] = [
  // Essentials
  { id: 'wifi', key: 'wifi', label: 'Free Wi-Fi', icon: 'Wifi', category: 'essentials' },
  { id: 'parking', key: 'parking', label: 'Free Parking', icon: 'Car', category: 'essentials' },
  { id: 'air_conditioning', key: 'air_conditioning', label: 'Air Conditioning', icon: 'Wind', category: 'essentials' },
  { id: 'heating', key: 'heating', label: 'Heating', icon: 'Fire', category: 'essentials' },
  { id: 'tv', key: 'tv', label: 'TV', icon: 'Monitor', category: 'essentials' },
  { id: 'safe', key: 'safe', label: 'Safe', icon: 'Lock', category: 'essentials' },

  // Facilities
  { id: 'pool', key: 'pool', label: 'Swimming Pool', icon: 'Sun1', category: 'facilities' },
  { id: 'gym', key: 'gym', label: 'Fitness Center', icon: 'Weight', category: 'facilities' },
  { id: 'spa', key: 'spa', label: 'Spa', icon: 'Heart', category: 'facilities' },
  { id: 'sauna', key: 'sauna', label: 'Sauna', icon: 'Fire', category: 'facilities' },
  { id: 'jacuzzi', key: 'jacuzzi', label: 'Jacuzzi', icon: 'Drop', category: 'facilities' },
  { id: 'conference_room', key: 'conference_room', label: 'Conference Room', icon: 'BrifecaseTick', category: 'facilities' },
  { id: 'kids_club', key: 'kids_club', label: 'Kids Club', icon: 'Play', category: 'facilities' },
  { id: 'playground', key: 'playground', label: 'Playground', icon: 'Game', category: 'facilities' },

  // Dining
  { id: 'restaurant', key: 'restaurant', label: 'Restaurant', icon: 'Coffee', category: 'dining' },
  { id: 'bar', key: 'bar', label: 'Bar', icon: 'Glass', category: 'dining' },
  { id: 'breakfast', key: 'breakfast', label: 'Breakfast Included', icon: 'Coffee', category: 'dining' },
  { id: 'room_service', key: 'room_service', label: 'Room Service', icon: 'ShoppingCart', category: 'dining' },
  { id: 'kitchen', key: 'kitchen', label: 'Kitchen', icon: 'Home2', category: 'dining' },
  { id: 'minibar', key: 'minibar', label: 'Minibar', icon: 'Cup', category: 'dining' },

  // Wellness
  { id: 'massage', key: 'massage', label: 'Massage Services', icon: 'Health', category: 'wellness' },
  { id: 'yoga', key: 'yoga', label: 'Yoga Classes', icon: 'Activity', category: 'wellness' },
  { id: 'medical', key: 'medical', label: 'Medical Services', icon: 'Hospital', category: 'wellness' },

  // Outdoor
  { id: 'beach_access', key: 'beach_access', label: 'Beach Access', icon: 'Sun', category: 'outdoor' },
  { id: 'garden', key: 'garden', label: 'Garden', icon: 'TreeCircle', category: 'outdoor' },
  { id: 'terrace', key: 'terrace', label: 'Terrace', icon: 'Home', category: 'outdoor' },
  { id: 'balcony', key: 'balcony', label: 'Balcony', icon: 'Building', category: 'outdoor' },
  { id: 'ski_access', key: 'ski_access', label: 'Ski Access', icon: 'Location', category: 'outdoor' },
  { id: 'hiking', key: 'hiking', label: 'Hiking Trails', icon: 'Map', category: 'outdoor' },

  // Services
  { id: '24h_reception', key: '24h_reception', label: '24h Reception', icon: 'Clock', category: 'services' },
  { id: 'concierge', key: 'concierge', label: 'Concierge', icon: 'Profile2User', category: 'services' },
  { id: 'laundry', key: 'laundry', label: 'Laundry Service', icon: 'Shirt', category: 'services' },
  { id: 'airport_shuttle', key: 'airport_shuttle', label: 'Airport Shuttle', icon: 'Airplane', category: 'services' },
  { id: 'pet_friendly', key: 'pet_friendly', label: 'Pet Friendly', icon: 'Heart', category: 'services' },
  { id: 'wheelchair', key: 'wheelchair', label: 'Wheelchair Accessible', icon: 'Security', category: 'services' },
  { id: 'non_smoking', key: 'non_smoking', label: 'Non-Smoking Rooms', icon: 'CloseCircle', category: 'services' },
];

export const AMENITIES_BY_CATEGORY = AMENITIES_LIST.reduce((acc, amenity) => {
  if (!acc[amenity.category]) {
    acc[amenity.category] = [];
  }
  acc[amenity.category].push(amenity);
  return acc;
}, {} as Record<string, Amenity[]>);

export const AMENITIES_MAP = AMENITIES_LIST.reduce((acc, amenity) => {
  acc[amenity.key] = amenity;
  return acc;
}, {} as Record<string, Amenity>);

export const CATEGORY_LABELS: Record<string, string> = {
  essentials: 'Essentials',
  facilities: 'Facilities',
  dining: 'Dining',
  wellness: 'Wellness',
  outdoor: 'Outdoor',
  services: 'Services',
};
