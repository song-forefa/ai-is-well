"use client";

import { useCallback, useRef } from "react";
import Image from "@tiptap/extension-image";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";

const MIN_PERCENT = 10;
const MAX_PERCENT = 100;

// 이미지 오른쪽 아래 모서리를 잡고 끌어 크기를 조절한다.
// 저장되는 값은 본문 폭 대비 % 라 모바일에서도 넘치지 않는다.
function ImageView({ node, updateAttributes, selected }: NodeViewProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const width = (node.attrs.width as string | null) ?? null;

  const startDrag = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const wrap = wrapRef.current;
      const img = wrap?.querySelector("img");
      const parentWidth = wrap?.parentElement?.getBoundingClientRect().width;
      if (!img || !parentWidth) return;

      const startX =
        "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const startWidth = img.getBoundingClientRect().width;

      const onMove = (ev: MouseEvent | TouchEvent) => {
        const x =
          "touches" in ev
            ? (ev as TouchEvent).touches[0].clientX
            : (ev as MouseEvent).clientX;
        const next = startWidth + (x - startX);
        const percent = Math.round((next / parentWidth) * 100);
        const clamped = Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, percent));
        updateAttributes({ width: `${clamped}%` });
      };

      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onUp);
    },
    [updateAttributes]
  );

  return (
    <NodeViewWrapper
      className={`rimg${selected ? " selected" : ""}`}
      data-align={node.attrs.align ?? "left"}
    >
      <div className="rimg-box" ref={wrapRef} style={width ? { width } : undefined}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={node.attrs.src} alt={node.attrs.alt ?? ""} draggable={false} />
        <span className="rimg-size">{width ?? "100%"}</span>
        <span
          className="rimg-handle"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          title="드래그해서 크기 조절"
        />
      </div>
    </NodeViewWrapper>
  );
}

// width(%) 와 align 을 저장하는 이미지 노드.
export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el) => (el as HTMLElement).style.width || null,
        renderHTML: (attrs) => (attrs.width ? { style: `width: ${attrs.width}` } : {}),
      },
      align: {
        default: null,
        parseHTML: (el) => (el as HTMLElement).getAttribute("data-align"),
        renderHTML: (attrs) => (attrs.align ? { "data-align": attrs.align } : {}),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});
