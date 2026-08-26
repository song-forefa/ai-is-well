import { loadSite } from "@/lib/loadSite";
import MagazineHome from "@/components/MagazineHome";
import EmptyNotice from "@/components/EmptyNotice";

export const dynamic = "force-dynamic";

// 정식 홈. 디자인 확정 전까지는 B안(매거진형)을 그대로 쓴다.
// 비교/투표용은 /1 /2 /3 참고.
export default async function HomePage() {
  const { items, settings, envMissing } = await loadSite();
  if (items.length === 0) return <EmptyNotice envMissing={envMissing} />;
  return <MagazineHome items={items} settings={settings} variant="magazine" />;
}
