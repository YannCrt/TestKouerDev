export type Category = {
  id_Category: number;
  Name_Category: string;
  product_count?: number;
};

export type Label = {
  id_Label: number;
  name_label: string;
  product_count?: number;
};

export type Product = {
  Id_Product: number;
  name_Product: string;
  Img_Product: string;
  price?: number;
  description?: string;
  Category?: Category;
  Labels?: Label[];
  created_at?: string;
};
