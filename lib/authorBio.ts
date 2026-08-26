import type { SiteSettings } from "@/lib/types";

// 글 하단 에디터 소개. 버전을 최대 3개까지 저장해 두고 하나를 골라 쓴다.
export const BIO_SLOTS = 3;

export type BioVersion = {
  label: string;
  name: string;
  text: string;
  linkUrl: string;
  linkLabel: string;
};

export const DEFAULT_BIO: BioVersion = {
  label: "기본",
  name: "애즈웰",
  text: `현대인을 위한 AI 트렌드 소식부터,
취업에 활용할 수 있는 AI 꿀팁과 트렌디한 소식
빠르게 전달드릴게요.

많은 관심과 팔로우 부탁드려요🫰`,
  linkUrl: "https://www.instagram.com/ai.is.well/",
  linkLabel: "애즈웰 | AI로 잘 먹고 잘 살기 (@ai.is.well)",
};

function emptyVersion(i: number): BioVersion {
  return { label: `버전 ${i + 1}`, name: "", text: "", linkUrl: "", linkLabel: "" };
}

// DB 에서 읽은 값을 항상 3칸 배열로 정규화한다. (컬럼이 없거나 비어 있어도 안전)
export function bioVersions(settings: SiteSettings): BioVersion[] {
  const raw = Array.isArray(settings.author_bios) ? settings.author_bios : [];
  return Array.from({ length: BIO_SLOTS }, (_, i) => {
    const v = (raw[i] ?? {}) as Partial<BioVersion>;
    const base = i === 0 ? DEFAULT_BIO : emptyVersion(i);
    return {
      label: (v.label ?? "").trim() || base.label,
      name: v.name ?? base.name,
      text: v.text ?? base.text,
      linkUrl: v.linkUrl ?? base.linkUrl,
      linkLabel: v.linkLabel ?? base.linkLabel,
    };
  });
}

export function activeIndex(settings: SiteSettings): number {
  const i = Number(settings.author_bio_active ?? 0);
  return Number.isInteger(i) && i >= 0 && i < BIO_SLOTS ? i : 0;
}

// 실제 글 하단에 노출할 버전.
// override 가 0~2 이면 그 버전을, 아니면 사이트 기본 버전을 쓴다.
// 고른 버전이 비어 있으면 기본 문구로 되돌린다.
export function activeBio(
  settings: SiteSettings,
  override?: number | null
): BioVersion {
  const i =
    typeof override === "number" && Number.isInteger(override) && override >= 0 && override < BIO_SLOTS
      ? override
      : activeIndex(settings);
  const v = bioVersions(settings)[i];
  return {
    ...v,
    name: v.name.trim() || DEFAULT_BIO.name,
    text: v.text.trim() || DEFAULT_BIO.text,
  };
}
