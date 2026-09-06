export interface LocaleUiLabels {
  searchOpen: string;
  searchClose: string;
  searchPlaceholder: string;
  searchSubmit: string;
  searchLoading: string;
  searchError: string;
  searchNoResults: string;
  recentUpdates: string;
  lastReviewed: string;
}

export interface SiteLocaleConfig {
  code: string;
  label: string;
  pathPrefix: string;
  htmlLang: string;
  openGraphLocale: string;
  ui: LocaleUiLabels;
}
