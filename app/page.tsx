import { publicClient } from "@/utils/supabase/public";
import type { Item, SiteSettings } from "@/lib/types";
import Card from "@/components/Card";

export const dynamic = "force-dynamic";

const DEFAULTS: SiteSettings = {
  id: 1,
  handle: "@ai.is.well",
  tagline: "📓 AI로 대기업 취뽀한 현직자의 꿀팁 아카이브!",
  avatar_url: null,
  footer_text: null,
};

async function load(): Promise<{ items: Item[]; settings: SiteSettings; error: string | null }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { items: [], settings: DEFAULTS, error: "env" };
  }
  const sb = publicClient();
  const [itemsRes, settingsRes] = await Promise.all([
    sb
      .from("items")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    sb.from("site_settings").select("*").eq("id", 1).maybeSingle(),
  ]);

  return {
    items: (itemsRes.data as Item[] | null) ?? [],
    settings: (settingsRes.data as SiteSettings | null) ?? DEFAULTS,
    error: itemsRes.error?.message ?? null,
  };
}

export default async function HomePage() {
  const { items, settings, error } = await load();

  return (
    <main className="hub">
      <header className="profile">
        {settings.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="avatar" src={settings.avatar_url} alt={settings.handle} />
        ) : (
          <div className="avatar-fallback">🤖</div>
        )}
        <h1>{settings.handle}</h1>
        <p>{settings.tagline}</p>
      </header>

      <div className="cards">
        {items.length === 0 ? (
          <div className="empty">
            {error === "env" ? (
              <>
                Supabase 환경변수가 아직 설정되지 않았어요.
                <br />
                <code>.env.local</code> 에 값을 채운 뒤 새로고침해 주세요.
              </>
            ) : (
              <>
                아직 등록된 항목이 없어요.
                <br />
                <a href="/admin" style={{ color: "var(--accent)", fontWeight: 700 }}>
                  관리자 페이지
                </a>
                에서 첫 항목을 추가해 보세요.
              </>
            )}
          </div>
        ) : (
          items.map((item) => <Card key={item.id} item={item} />)
        )}
      </div>

      {settings.footer_text ? (
        <div className="hub-footer">{settings.footer_text}</div>
      ) : null}
    </main>
  );
}
