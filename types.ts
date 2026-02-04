
export interface RakutenItem {
  rank: number;
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  affiliateUrl: string;
  mediumImageUrls: { imageUrl: string }[];
  shopName: string;
}

export interface Genre {
  id: string;
  name: string;
}

export enum LoadingStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}
