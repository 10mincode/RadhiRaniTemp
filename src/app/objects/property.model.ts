export class Property {
  propertyId!: string;
  propertyName!: string;
  location!: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    nearbyLandmarks: string[];
  };
  description!: string;
  propertyType!: string;
  status!: string;
  dateListed!: string;
  dateUpdated!: string;
  actualPrice!: number;
  showcasePrice!: string;
  pricePerSqFt!: number;
  minBookingAmount!: number;
  furnishing!: string;
  facing!: string;
  propertyAge!: string;
  legalClearances!: {
    reraId: string;
    approvedBy: string[];
  };
  features!: {
    bedrooms: number;
    bathrooms: number;
    areaSqFt: number;
    floor: string;
    totalFloors: number;
    yearBuilt: number;
    amenities: {
      parks: boolean;
      garden: boolean;
      swimmingPool: boolean;
      gym: boolean;
      security: boolean;
      parking: boolean;
      playArea: boolean;
      clubHouse: boolean;
      shoppingCenter: boolean;
      publicTransport: boolean;
      cCRoads: boolean;
      powerBackup: boolean;
      waterSupply: boolean;
      wideSewage: boolean;
      rainWaterHarvesting: boolean;
      fireSafety: boolean;
      smartHome: boolean;
      petFriendly: boolean;
      movieHall: boolean;
      accessibility: string[];
    };
  };
  media!: {
    thumbnail: string;
    images: string[];
  };
}
