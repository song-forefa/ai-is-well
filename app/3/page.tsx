import type { Metadata } from "next";
import { loadSite } from "@/lib/loadSite";
import MagazineHome from "@/components/MagazineHome";
import VersionBar from "@/components/VersionBar";
import EmptyNotice from "@/components/EmptyNotice";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "디자인 C · 절충형 — ai.is.well" };

export default async function DesignC() {
  const { items, settings, envMissing } = await loadSite();
  return (
    <div className="vpage">
      {items.length === 0 ? (
        <EmptyNotice envMissing={envMissing} />
      ) : (
        <MagazineHome items={items} settings={settings} variant="slim" />
      )}
      <VersionBar current="/3" />
    </div>
  );
}
