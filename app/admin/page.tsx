import Link from "next/link";
import { adminClient } from "@/utils/supabase/admin";
import type { Item, SiteSettings } from "@/lib/types";
import AdminList from "@/components/AdminList";
import SettingsForm from "@/components/SettingsForm";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  handle: "@ai.is.well",
  tagline: "📓 AI로 대기업 취뽀한 현직자의 꿀팁 아카이브!",
  avatar_url: null,
  footer_text: null,
};

export default async function AdminPage() {
  let items: Item[] = [];
  let settings: SiteSettings = DEFAULT_SETTINGS;
  let error: string | null = null;

  try {
    const sb = adminClient();
    const [itemsRes, settingsRes] = await Promise.all([
      sb
        .from("items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
      sb.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    ]);
    if (itemsRes.error) throw new Error(itemsRes.error.message);
    items = (itemsRes.data as Item[]) ?? [];
    settings = (settingsRes.data as SiteSettings | null) ?? DEFAULT_SETTINGS;
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div className="admin">
      <div className="admin-top">
        <h1>콘텐츠 관리</h1>
        <div className="actions">
          <Link className="btn" href="/" target="_blank">
            공개 페이지 ↗
          </Link>
          <LogoutButton />
          <Link className="btn primary" href="/admin/new">
            + 새 항목
          </Link>
        </div>
      </div>

      {error ? (
        <div className="panel">
          <div className="err" style={{ marginTop: 0 }}>
            데이터를 불러오지 못했습니다: {error}
          </div>
          <div className="hint">
            Supabase 환경변수와 <code>supabase/schema.sql</code> 실행 여부를 확인해 주세요.
          </div>
        </div>
      ) : (
        <>
          <SettingsForm initial={settings} />
          <AdminList initial={items} />
        </>
      )}
    </div>
  );
}
