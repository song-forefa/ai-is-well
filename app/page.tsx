import { loadSite } from "@/lib/loadSite";
import MagazineHome from "@/components/MagazineHome";
import EmptyNotice from "@/components/EmptyNotice";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { items, settings, envMissing } = await loadSite();
  if (items.length === 0) return <EmptyNotice envMissing={envMissing} />;
  return <MagazineHome items={items} settings={settings} />;
}
