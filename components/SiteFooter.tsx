import type { SiteSettings } from "@/lib/types";

export default function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">{settings.handle}</div>
        <p>{settings.footer_text ?? settings.tagline}</p>
        <div className="site-footer-meta">
          © {new Date().getFullYear()} {settings.handle.replace(/^@/, "")}
        </div>
      </div>
    </footer>
  );
}
