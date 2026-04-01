export type LibraryTemplateRow = {
  id: string;
  name: string;
  description: string;
  canvaTemplateUrl: string;
  format?: string;
  pages?: number;
  category?: string;
  deliveryKind: "html" | "canva" | "placeholder";
};

export type LibraryProductRow = {
  productId: string;
  displayName: string;
  description: string;
  version?: string;
  priceUSD?: number;
  etsySku?: string;
  category?: string;
  targetBuyer?: string;
  templates: LibraryTemplateRow[];
  sourceFile: string;
  filledCount: number;
  totalCount: number;
};
