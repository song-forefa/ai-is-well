import sanitizeHtml from "sanitize-html";

// 에디터에서 넘어온 HTML 을 허용 태그만 남기고 정리한다.
// (관리자만 쓸 수 있지만, 저장 시점에 한 번 걸러 두면 렌더링이 안전하다)
export function cleanHtml(dirty: string): string {
  return sanitizeHtml(dirty || "", {
    allowedTags: [
      "p", "br", "strong", "b", "em", "i", "u", "s", "mark",
      "h1", "h2", "h3", "h4",
      "ul", "ol", "li", "blockquote", "pre", "code", "hr",
      "a", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td", "span", "div",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      span: ["style"],
      div: ["style"],
      p: ["style"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https", "data"] },
    allowedStyles: {
      "*": {
        "text-align": [/^left$|^right$|^center$|^justify$/],
        color: [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(/],
        "background-color": [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(/],
      },
    },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName: "a",
        attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer" },
      }),
    },
  });
}
