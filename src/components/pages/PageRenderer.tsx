import { ContentPage } from "@/components/pages/ContentPage";
import { HomePage } from "@/components/pages/HomePage";
import { HubPage } from "@/components/pages/HubPage";
import { WorkspacePage } from "@/components/pages/WorkspacePage";
import type { PageContent } from "@/types/content";

function assertNever(value: never): never {
  throw new Error(`Unsupported page shell: ${JSON.stringify(value)}`);
}

export function PageRenderer({ page }: { page: PageContent }) {
  const presentation = page.presentation;

  switch (presentation.shell) {
    case "home":
      return <HomePage page={page} />;
    case "hub":
      return <HubPage page={page} />;
    case "content":
      return <ContentPage page={page} />;
    case "workspace":
      return <WorkspacePage page={page} />;
    default:
      return assertNever(presentation);
  }
}
