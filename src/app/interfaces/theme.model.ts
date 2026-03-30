export interface StoreTheme {
  primary_color: string;
  logo_url: string | null;
  banner_url: string | null;
  layout_config: {
    hero?: boolean;
    [key: string]: any;
  };
}
