import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, CircleHelp, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { sendDocument } from "@/lib/storage";
import * as pdfjsLib from "pdfjs-dist";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton"
import Viewer from "react-viewer";
import { useEffect, useRef, useState } from "react";

export function FileUploadBlock({
  label,
  id,
  tooltip,
  userId,
  associationId,
  documentsAssociation,
  documentType,
  setFile,
  value,
  allowEdit = true
}) {
  const [preview, setPreview] = useState(value);
  const [fileName, setFileName] = useState("");
  const [isImage, setIsImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);
  const viewerContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const { user } = useAuth();

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true); // inicia o loading
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
        setIsLoading(false);
      };
      fileReader.readAsArrayBuffer(file);
    } else {
      const localPreviewUrl = URL.createObjectURL(file);
      setPreview(localPreviewUrl);
      setIsImage(true);
      setIsLoading(false);
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
      return parts[parts.length - 1]
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

      {isLoading ? (
        <Skeleton className="w-full h-14 rounded-md" />
      ) : preview ? (
        <div className="relative w-full">
          <div
            className="flex items-center border rounded-md px-3 py-2 gap-3 bg-white cursor-pointer truncate"
            onClick={() => {
              setShowModal(true);
              setIsPreviewLoaded(false);
            }}
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
            <p className="text-sm text-gray-700 truncate">
              {value ? getFileNameFromFirebaseUrl(value) : fileName}
            </p>
          </div>

          {allowEdit && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-3 right-1 text-xs text-sky-600 bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Editar
              </Button>
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,application/pdf"
              />
            </>
          )}
        </div>
      ) : (
        <Input
          type="file"
          id={id}
          onChange={handleFileChange}
          accept="image/*,application/pdf"
          className={'w-full'}
        />
      )}

      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-20 py-10"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg w-full h-full p-10 flex flex-col space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <p className={'font-bold text-xl mb-2'}>Tipo de documento: {documentType.toUpperCase().replaceAll('_', ' ')}</p>
            {isImage ? (
              <>
                {!isPreviewLoaded && (
                  <Skeleton className="w-full h-full rounded-xl border border-teal-500" />
                )}

                <div
                  ref={viewerContainerRef}
                  className={`${isPreviewLoaded ? "block" : "hidden"} w-full h-full rounded-xl border border-teal-500`}
                />

                {isPreviewLoaded && viewerContainerRef.current && (
                  <Viewer
                    visible
                    container={viewerContainerRef.current}
                    images={[{ src: preview, alt: 'Preview' }]}
                    noNavbar
                    attribute={false}
                    drag={false}
                    zoomable
                    scalable
                    rotatable
                    onClose={() => { }}
                    zoomSpeed={1}
                  />
                )}

                <img
                  src={preview}
                  alt="Preview"
                  className="hidden"
                  onLoad={() => setIsPreviewLoaded(true)}
                />
              </>
            ) : (
              <>
                {!isPreviewLoaded && (
                  <Skeleton className="w-full h-full rounded-xl border border-teal-500" />
                )}
                {value && (
                  <iframe
                    src={value}
                    title="Documento"
                    className={`${isPreviewLoaded ? "block" : "hidden"} w-full h-full rounded-xl border border-teal-500`}
                    onLoad={() => setIsPreviewLoaded(true)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}