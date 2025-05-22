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
import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import Text from "./Text";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";

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
  const [isImage, setIsImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

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
        setIsImage(false);
      };
      fileReader.readAsArrayBuffer(file);
    } else {
      const localPreviewUrl = URL.createObjectURL(file);
      setPreview(localPreviewUrl);
      setIsImage(true);
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

  useEffect(() => {
    if (!value) return;

    // Tenta carregar como imagem
    const img = new Image();
    img.onload = () => {
      setIsImage(true);
      setPreview(value);
    };
    img.onerror = () => {
      setIsImage(false);
      setPreview(value);
    };
    img.src = value;
  }, [value]);

  function getFileNameFromFirebaseUrl(url) {
    try {
      const decodedPath = decodeURIComponent(
        new URL(url).pathname.split("/o/")[1].split("?")[0]
      )
      const parts = decodedPath.split("/")
      return parts[parts.length - 1] // último item do caminho
    } catch (err) {
      console.error("Erro ao extrair nome do arquivo:", err)
      return null
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
        <div
          className="flex items-center border rounded-md px-3 py-2 gap-3 w-80 bg-white cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded-md border">
            {isImage ? (
              <img
                src={preview}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                PDF
              </div>
            )}
          </div>
          <span className="text-sm text-gray-700 truncate">
            {value ? getFileNameFromFirebaseUrl(value) : fileName}
          </span>
        </div>
      ) : (
        <Input
          type="file"
          id={id}
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
      )}

      {/* Modal para PDF */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg overflow-hidden w-11/12 h-5/6 p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <p className={'font-bold text-xl mb-2'}>Tipo de documento: {documentType.toUpperCase().replaceAll('_', ' ')}</p>
            {
              isImage
                ?
                <img
                  src={preview}
                  alt="Preview"
                />
                :
                <iframe
                  src={value}
                  title="Documento"
                  className="w-full h-full rounded"
                />
            }
            {
              user.role === 'admin'
              &&
              <div>
                <Button variant={'destructive'}>Rejeitar</Button>
                <Button variant={'positive'}>Aprovar</Button>
              </div>
            }
          </div>
        </div>
      )}
    </div>
  );
}