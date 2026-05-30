export class Property {
  propertyId!: string;
  propertyName!: string;
  location!: {
    address: string;
    city: string;
    locality: string;
    state: string;
    postalCode: string;
    nearbyLandmarks: string[];
  };
  description!: string;
  propertyType!: string;
  status!: string;
  dateListed!: string;
  dateUpdated!: string;
  startingPrice!: number;
  priceUnit!: string;
  minBookingAmount!: number;
  propertyAge!: string;
  yearBuilt!: number;
  legalClearances!: {
    reraId: string;
    approvedBy: string[];
  };
  amenities!: string[];
  media!: {
    thumbnail: string;
    images: string[];
  };
  videoUrls!: string[];
  views!: number;
  isFeatured!: boolean;
  isVisible!: boolean;
}