import { Node, mergeAttributes } from "@tiptap/core";

// 접었다 펴는 토글 블록. 저장되는 HTML 은 <details><summary>제목</summary><div>내용</div></details>.
//
// 에디터 안에서는 항상 펼쳐 보여야 편집이 가능하므로 renderHTML 에서 open 을 붙인다.
// 저장 시 sanitize-html 이 details 의 open 속성을 허용 목록에서 빼 자동으로 제거하므로,
// 공개 페이지에서는 접힌 상태로 시작한다.

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    toggleBlock: {
      insertToggle: () => ReturnType;
    };
  }
}

export const ToggleSummary = Node.create({
  name: "toggleSummary",
  content: "inline*",
  defining: true,
  selectable: false,
  parseHTML() {
    return [{ tag: "summary" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["summary", mergeAttributes(HTMLAttributes), 0];
  },
});

export const ToggleContent = Node.create({
  name: "toggleContent",
  content: "block+",
  defining: true,
  parseHTML() {
    return [{ tag: "div[data-toggle-content]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-toggle-content": "" }),
      0,
    ];
  },
});

export const ToggleBlock = Node.create({
  name: "toggleBlock",
  group: "block",
  content: "toggleSummary toggleContent",
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: "details" }];
  },

  renderHTML({ HTMLAttributes }) {
    // open 은 에디터 편집용. 저장 시 sanitize 단계에서 제거된다.
    return ["details", mergeAttributes(HTMLAttributes, { open: "" }), 0];
  },

  addCommands() {
    return {
      insertToggle:
        () =>
        ({ chain }) =>
          chain()
            .insertContent({
              type: this.name,
              content: [
                {
                  type: "toggleSummary",
                  content: [{ type: "text", text: "제목을 입력하세요" }],
                },
                {
                  type: "toggleContent",
                  content: [{ type: "paragraph" }],
                },
              ],
            })
            .run(),
    };
  },
});
