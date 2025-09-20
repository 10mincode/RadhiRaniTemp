export class Property {
  PropertyID!: string;
  PropertyName!: string;
  Location!: {
    Address: string;
    City: string;
    State: string;
    PostalCode: string;
    Latitude: number;
    Longitude: number;
    NearbyLandmarks: string[];
  };
  Description!: string;
  PropertyType!: string;
  Status!: string;
  DateListed!: string;
  DateUpdated!: string;
  ActualPrice!: number;
  ShowcasePrice!: string;
  PricePerSqFt!: number;
  MinBookingAmount!: number;
  Furnishing!: string;
  Facing!: string;
  PropertyAge!: string;
  LegalClearances!: {
    RERA_ID: string;
    ApprovedBy: string[];
  };
  Features!: {
    Bedrooms: number;
    Bathrooms: number;
    AreaSqFt: number;
    Floor: string;
    TotalFloors: number;
    YearBuilt: number;
    Amenities: {
      Parks: boolean;
      Garden: boolean;
      SwimmingPool: boolean;
      Gym: boolean;
      Security: boolean;
      Parking: boolean;
      PlayArea: boolean;
      ClubHouse: boolean;
      ShoppingCenter: boolean;
      PublicTransport: boolean;
      CCRoads: boolean;
      PowerBackup: boolean;
      Lift: boolean;
      WaterSupply: boolean;
      WideSewage: boolean;
      RainWaterHarvesting: boolean;
      FireSafety: boolean;
      SmartHome: boolean;
      PetFriendly: boolean;
      Accessibility: string[];
    };
  };
  Media!: {
    Thumbnail: string;
    Images: string[];
  };
}
