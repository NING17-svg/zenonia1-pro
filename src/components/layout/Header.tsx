import Link from "next/link";
import { SearchDialog } from "@/components/layout/SearchDialog";
import { navigationLabel, primaryNavigation } from "@/data/navigation";
import { site } from "@/data/site";
import { getLocaleUiLabels, localizePath } from "@/lib/localization";
import { getSearchIndexUrl } from "@/lib/search";

export function Header({ locale }: { locale: string }) {
  return (
    <header className="site-header">
      <Link href={localizePath("/", locale)} className="brand">
        {site.brandMark ? (
          <span className="brand-mark" aria-hidden="true">
            {site.brandMark}
          </span>
        ) : null}
        <span>{site.name}</span>
      </Link>
      <nav className="primary-nav" aria-label="Primary navigation">
        {primaryNavigation.map((item) => {
          const href = localizePath(item.href, locale);
          return (
            <Link key={href} href={href}>
              {navigationLabel(item, locale)}
            </Link>
          );
        })}
      </nav>
      <SearchDialog
        locale={locale}
        indexUrl={getSearchIndexUrl(locale)}
        labels={getLocaleUiLabels(locale)}
      />
    </header>
  );
}
