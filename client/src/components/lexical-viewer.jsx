import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import '@/styles/editor-toolbar.css'

function ReadOnlyStatePlugin({ initialJson }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const editorState = editor.parseEditorState(initialJson);
    editor.setEditorState(editorState);
    editor.setEditable(false);
  }, [editor, initialJson]);

  return null;
}

export default function LexicalViewer({ jsonContent, styles = "prose text-white max-w-none" }) {
  const initialConfig = {
    namespace: 'Viewer',
    onError: (error) => {
      console.error('Lexical Error:', error);
    },
    editorState: null,
    editable: false,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
    ]
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ReadOnlyStatePlugin initialJson={jsonContent} />
      <RichTextPlugin
        contentEditable={<ContentEditable className={styles} id="editor_toolbar" />}
        placeholder={null}
      />
      <HistoryPlugin />
    </LexicalComposer>
  );
}
