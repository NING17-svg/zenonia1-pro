import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { theme } from "@/data/theme";
import { getLocaleConfig } from "@/lib/localization";
import { themeClassName, themeStyle } from "@/lib/theme";

export function PageShell({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const localeConfig = getLocaleConfig(locale);

  return (
    <div
      className={themeClassName(theme)}
      style={themeStyle(theme)}
      data-locale={locale}
    >
      <Header locale={locale} />
      <main lang={localeConfig.htmlLang}>{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
