import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { sendDocument } from "@/lib/storage";
import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

export function FileUploadBlock({
  label,
  id,
  tooltip,
  userId,
  associationId,
  documentsAssociation,
  documentType,
  setFile,
  value
}) {
  const [preview, setPreview] = useState(value);
  const [fileName, setFileName] = useState("");

  console.log({ preview, value })

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const isPdfFile = file.type === "application/pdf";

    if (isPdfFile) {
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        const typedarray = new Uint8Array(this.result);

        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        const imgData = canvas.toDataURL();
        setPreview(imgData);
      };
      fileReader.readAsArrayBuffer(file);
    } else {
      const localPreviewUrl = URL.createObjectURL(file);
      setPreview(localPreviewUrl);
    }

    const documentUrl = await sendDocument(
      file,
      userId,
      associationId,
      documentsAssociation,
      documentType
    );

    if (documentUrl) {
      setFile(documentUrl.fileUrl);
    }
  }

  return (
    <div className="flex flex-col w-80 gap-2">
      <div className="flex w-full justify-between">
        <Label htmlFor={id}>{label}</Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CircleHelp
                  size={20}
                  className="text-sky-600"
                  strokeWidth={3}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {preview ? (
        <div className="flex items-center border rounded-md px-3 py-2 gap-3 w-80 bg-white">
          <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded-md border">
            <img src={preview} alt="Preview" className="object-cover w-full h-full" />
          </div>
          <span className="text-sm text-gray-700 truncate">{fileName}</span>
        </div>
      ) : (
        <Input
          type="file"
          id={id}
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
      )}
    </div>
  );
}
