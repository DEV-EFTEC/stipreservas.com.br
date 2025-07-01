// EditorToolbar.jsx
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  $createParagraphNode,
  $setSelection,
  $createRangeSelection,
} from "lexical";
import { $wrapNodes } from "@lexical/selection"; // Importe $wrapNodes daqui!
import { $isListNode } from "@lexical/list";
import { $isHeadingNode, $createHeadingNode } from "@lexical/rich-text"; // $createHeadingNode já vem do rich-text
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { Bold, Heading2, Italic, List, ListOrdered, ListX } from "lucide-react";
import { Button } from "./ui/button";

export default function EditorToolbar() {
  const [editor] = useLexicalComposerContext();

  const toggleBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  const toggleItalic = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  const insertBulletList = () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
  const insertNumberList = () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
  const removeList = () => editor.dispatchCommand(REMOVE_LIST_COMMAND);

  const makeHeading = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Envolve os nós selecionados com um novo nó de cabeçalho (h2)
        $wrapNodes(selection, () => $createHeadingNode("h2"));
      }
    });
  };

  return (
    <div className="flex gap-2 mb-2" id="editor_toolbar">
      <Tooltip>
        <TooltipTrigger>
          <Button variant="outline" onClick={toggleBold}><Bold /></Button>
        </TooltipTrigger>
        <TooltipContent>Negrito</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="outline" onClick={toggleItalic}><Italic /></Button>
        </TooltipTrigger>
        <TooltipContent>Itálico</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="outline" onClick={makeHeading}><Heading2 /></Button>
        </TooltipTrigger>
        <TooltipContent>Título 2</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="outline" onClick={insertBulletList}><List /></Button>
        </TooltipTrigger>
        <TooltipContent>Lista</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="outline" onClick={insertNumberList}><ListOrdered /></Button>
        </TooltipTrigger>
        <TooltipContent>Lista ordenada</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="outline" onClick={removeList}><ListX /></Button>
        </TooltipTrigger>
        <TooltipContent>Limpar lista</TooltipContent>
      </Tooltip>
    </div>
  );
}