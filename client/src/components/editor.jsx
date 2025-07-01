// LexicalEditor.jsx
import React, { useState } from "react";
import {
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import EditorToolbar from "./editor-toolbar";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { Button } from "./ui/button";
import '@/styles/editor-toolbar.css'

function SavePlugin({ onSave }) {
  const [editor] = useLexicalComposerContext();

  const handleSave = () => {
    const editorState = editor.getEditorState();
    const json = editorState.toJSON();
    if (onSave) onSave(json);
  };

  return (
    <Button
      variant={'positive'}
      onClick={handleSave}
      className={'mt-2 w-full'}
    >
      Salvar
    </Button>
  );
}

export default function LexicalEditor({ initialJson, onSave, setContent }) {
  const initialConfig = {
    namespace: "MyEditor",
    theme: {
      paragraph: "",
    },
    editorState: initialJson
      ? () => JSON.parse(JSON.stringify(initialJson))
      : undefined,
    onError: (error) => {
      console.error("Lexical error:", error);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
    ],
  };

  return (
    <div className="border rounded-xl shadow-sm p-4 w-full">
      <LexicalComposer initialConfig={initialConfig}>
        <EditorToolbar />
        <RichTextPlugin
          contentEditable={<ContentEditable className="min-h-[120px] border p-2 rounded outline-none" id="editor_toolbar" />}
          placeholder={<div className="text-gray-400 absolute top-2 left-2">Escreva algo...</div>}
        />
        <HistoryPlugin />
        <ListPlugin />
        <OnChangePlugin
          onChange={(editorState) => {
            const json = editorState.toJSON();
            if (setContent) setContent(json);
          }}
        />
        <SavePlugin onSave={onSave} />
      </LexicalComposer>
    </div>
  );
}
