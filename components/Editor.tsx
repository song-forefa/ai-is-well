"use client";

import { useCallback, useRef } from "react";
import { useEditor, EditorContent, type Editor as TiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { ToggleBlock, ToggleContent, ToggleSummary } from "@/lib/tiptap/toggle";
import { Placeholder } from "@tiptap/extensions";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

function Btn({
  editor,
  onClick,
  active,
  title,
  children,
}: {
  editor: TiptapEditor | null;
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={!editor}
      style={
        active
          ? { background: "#fff", borderColor: "var(--accent)", color: "var(--accent)" }
          : undefined
      }
    >
      {children}
    </button>
  );
}

export default function Editor({ value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: "내용을 입력하세요…" }),
      ToggleBlock,
      ToggleSummary,
      ToggleContent,
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "editor-area prose",
      },
      handleDOMEvents: {
        // <details> 는 summary 를 클릭하면 접히는 게 기본 동작이다.
        // 편집 중에 접히면 내용을 고칠 수 없으므로 접힘만 막고 커서 이동은 그대로 둔다.
        click: (_view, event) => {
          const el = event.target as HTMLElement | null;
          if (el?.closest("summary")) event.preventDefault();
          return false;
        },
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const input = window.prompt("링크 주소를 입력하세요 (비우면 링크 해제)", prev ?? "https://");
    if (input === null) return;
    const url = input.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    const href = /^(https?:\/\/|mailto:|tel:)/i.test(url) ? url : `https://${url}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }, [editor]);

  const imageByUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("이미지 주소(URL)를 입력하세요");
    if (!url) return;
    editor.chain().focus().setImage({ src: url.trim() }).run();
  }, [editor]);

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        window.alert(json.error ?? "업로드에 실패했습니다.");
        return;
      }
      editor.chain().focus().setImage({ src: json.url }).run();
    },
    [editor]
  );

  return (
    <div className="editor">
      <div className="editor-bar">
        <Btn editor={editor} title="굵게 (Cmd+B)" active={editor?.isActive("bold")}
          onClick={() => editor?.chain().focus().toggleBold().run()}>
          <b>B</b>
        </Btn>
        <Btn editor={editor} title="기울임 (Cmd+I)" active={editor?.isActive("italic")}
          onClick={() => editor?.chain().focus().toggleItalic().run()}>
          <i>I</i>
        </Btn>
        <Btn editor={editor} title="밑줄 (Cmd+U)" active={editor?.isActive("underline")}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}>
          <u>U</u>
        </Btn>
        <Btn editor={editor} title="취소선" active={editor?.isActive("strike")}
          onClick={() => editor?.chain().focus().toggleStrike().run()}>
          <s>S</s>
        </Btn>

        <span className="sep" />

        <Btn editor={editor} title="제목 1" active={editor?.isActive("heading", { level: 2 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
          H1
        </Btn>
        <Btn editor={editor} title="제목 2" active={editor?.isActive("heading", { level: 3 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
          H2
        </Btn>
        <Btn editor={editor} title="제목 3" active={editor?.isActive("heading", { level: 4 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}>
          H3
        </Btn>

        <span className="sep" />

        <Btn editor={editor} title="글머리 목록" active={editor?.isActive("bulletList")}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          • 목록
        </Btn>
        <Btn editor={editor} title="번호 목록" active={editor?.isActive("orderedList")}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          1. 목록
        </Btn>
        <Btn editor={editor} title="인용" active={editor?.isActive("blockquote")}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
          “ ”
        </Btn>
        <Btn editor={editor} title="코드 블록" active={editor?.isActive("codeBlock")}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
          {"</>"}
        </Btn>
        <Btn editor={editor} title="구분선"
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
          ―
        </Btn>
        <Btn editor={editor} title="토글 (접었다 펴기)" active={editor?.isActive("toggleBlock")}
          onClick={() => editor?.chain().focus().insertToggle().run()}>
          ▸ 토글
        </Btn>

        <span className="sep" />

        <Btn editor={editor} title="링크 걸기" active={editor?.isActive("link")} onClick={setLink}>
          🔗 링크
        </Btn>
        <Btn editor={editor} title="이미지 업로드" onClick={() => fileRef.current?.click()}>
          🖼 이미지
        </Btn>
        <Btn editor={editor} title="이미지 주소로 삽입" onClick={imageByUrl}>
          URL 이미지
        </Btn>

        <span className="sep" />

        <Btn editor={editor} title="서식 지우기"
          onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}>
          서식 해제
        </Btn>
        <Btn editor={editor} title="실행 취소" onClick={() => editor?.chain().focus().undo().run()}>
          ↶
        </Btn>
        <Btn editor={editor} title="다시 실행" onClick={() => editor?.chain().focus().redo().run()}>
          ↷
        </Btn>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void uploadImage(f);
          e.target.value = "";
        }}
      />

      <EditorContent editor={editor} />
    </div>
  );
}
