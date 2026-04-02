export interface StoreBrand {
  store_name: string;
  store_tagline: string;
  logo_url: string | null;
  favicon_url: string | null;
}

export interface StoreThemeConfig {
  primary_color: string;
  accent_color: string;
  background_style: 'light' | 'dark';
  font_family: string;
}

export interface StoreHero {
  promo_badge: string;
  headline: string;
  sub_headline: string;
  hero_image_url: string | null;
}

export interface StoreLayout {
  show_hero: boolean;
  show_trust_signals: boolean;
  show_featured_products: boolean;
}

export interface StoreSocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  [key: string]: string | undefined;
}

export interface StoreContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

export interface StoreFooter {
  social_links: StoreSocialLinks;
  contact_info: StoreContactInfo;
  copyright: string;
}

export interface StoreConfig {
  domain: string;
  tenant_id: string;
  brand: StoreBrand;
  theme: StoreThemeConfig;
  hero: StoreHero;
  layout: StoreLayout;
  footer: StoreFooter;
}
