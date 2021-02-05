export interface DemoDatagrid10KDataInterface {
  id: number;
  username: string;
  gender: string;
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  eye_color: string;
  company: string;
  address: string;
  country: string;
  country_code: string;
  phone: string | null;
  ip_address: string;
  is_active: boolean;
  is_registered: boolean;
  avatar: string | null;
  favourite_animal: string | null;
  creation_date: string;
  epoch_date: string;
  favorite_movie: string | null;
  user_agent: string;
}

export interface DemoDatagridSynchronousDataInterface {
  id: string;
  name: string;
  email: string;
  address: string;
}
