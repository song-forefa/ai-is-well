import type { Metadata } from "next";
import { loadSite } from "@/lib/loadSite";
import LinkTreeHome from "@/components/LinkTreeHome";
import VersionBar from "@/components/VersionBar";
import EmptyNotice from "@/components/EmptyNotice";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "디자인 A · 링크트리형 — ai.is.well" };

export default async function DesignA() {
  const { items, settings, envMissing } = await loadSite();
  return (
    <div className="vpage">
      {items.length === 0 ? (
        <EmptyNotice envMissing={envMissing} />
      ) : (
        <LinkTreeHome items={items} settings={settings} />
      )}
      <VersionBar current="/1" />
    </div>
  );
}
