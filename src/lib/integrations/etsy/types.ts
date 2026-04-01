export type DraftListingInput = {
  title: string;
  description: string;
  price: number;
  quantity: number;
  tags: string[];
  taxonomyId: number;
  isDigital: boolean;
  whoMade?: string;
  whenMade?: string;
};

export type EtsyListingResult = {
  ok: boolean;
  listingId?: number;
  state?: string;
  url?: string;
  error?: string;
  httpStatus?: number;
};

export class EtsyServiceError extends Error {
  constructor(
    message: string,
    public httpStatus?: number,
    public etsyError?: unknown,
  ) {
    super(message);
    this.name = "EtsyServiceError";
  }
}
