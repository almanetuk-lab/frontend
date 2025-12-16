import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Extension } from "@tiptap/core";

/* 🔹 Custom Font Size */
const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: null }).run(),
    };
  },
});

export default function TiptapEditor({ content = "", onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image,
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

 useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "", false);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-md bg-white shadow-sm">
      {/* 🔹 TOOLBAR */}
      <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-100">
        {/* Headings */}
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className="btn"
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="btn"
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className="btn"
        >
          H3
        </button>

        {/* Text Styles */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="btn"
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="btn"
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="btn"
        >
          U
        </button>

        {/* Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className="btn"
        >
          ⬅
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className="btn"
        >
          ⬆
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className="btn"
        >
          ➡
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className="btn"
        >
          ☰
        </button>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="btn"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="btn"
        >
          1. List
        </button>

        {/* Font Size */}
        <select
          onChange={(e) =>
            editor.chain().focus().setFontSize(e.target.value).run()
          }
          className="border px-2"
          defaultValue=""
        >
          <option value="" disabled>
            Font
          </option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="22px">22</option>
          <option value="26px">26</option>
        </select>

        {/* Color */}
        <input
          type="color"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
        />

        {/* Link */}
        <button
          onClick={() => {
            const url = prompt("Enter link");
            if (!url) return;
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
          className="btn"
        >
          🔗
        </button>

        {/* Image */}
        <button
          onClick={() => {
            const url = prompt("Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          className="btn"
        >
          🖼️
        </button>

        {/* Undo / Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="btn"
        >
          ↩
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="btn"
        >
          ↪
        </button>
      </div>

      {/* 🔹 EDITOR */}
      <EditorContent
        editor={editor}
        className="editor min-h-[300px] p-4 focus:outline-none"
      />
    </div>
  );
}
