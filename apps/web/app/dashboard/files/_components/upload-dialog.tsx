"use client";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@workspace/ui/components/dropzone";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useAction } from "convex/react";
import { useState } from "react";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUploaded?: () => void;
}

const UploadDialog = ({
  open,
  onOpenChange,
  onFileUploaded,
}: UploadDialogProps) => {
  const addFile = useAction(api.private.files.addFile);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    category: "",
    filename: "",
  });
  const hanldeFileDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFiles([file]);
      if (!uploadForm.filename) {
        setUploadForm((prev) => ({
          ...prev,
          filename: file.name,
        }));
      }
    }
  };
  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const blob = uploadedFiles[0];
      if (!blob) return;
      const filename = uploadForm.filename || blob.name;
      await addFile({
        bytes: await blob.arrayBuffer(),
        filename,
        mimeType: blob.type || "text/plain",
        category: uploadForm.category,
      });
      onFileUploaded?.();
      handleCancelUpload();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = () => {
    onOpenChange(false);
    setUploadedFiles([]);
    setUploadForm({
      category: "",
      filename: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Upload Document
          </DialogTitle>
          <DialogDescription>
            Upload documents to your knowledge base for AI-powered search and
            context retrieval
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="font-semibold">
              Category
            </Label>
            <Input
              type="text"
              id="category"
              value={uploadForm.category}
              onChange={(e) =>
                setUploadForm((prev) => ({ ...prev, category: e.target.value }))
              }
              placeholder="e.g... Documentation, Support, Product"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filename" className="font-semibold">
              Filename{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              type="text"
              id="filename"
              value={uploadForm.filename}
              onChange={(e) =>
                setUploadForm((prev) => ({ ...prev, filename: e.target.value }))
              }
              placeholder="Override default filename"
              className="w-full"
            />
          </div>
          <Dropzone
            accept={{
              "application/pdf": [".pdf"],
              "text/csv": [".csv"],
              "text/plain": [".txt"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
            }}
            disabled={isUploading}
            maxFiles={1}
            onDrop={hanldeFileDrop}
            src={uploadedFiles}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </div>
        <DialogFooter>
          <Button
            disabled={isUploading}
            variant="ghost"
            onClick={handleCancelUpload}
          >
            Cancel
          </Button>
          <Button
            disabled={
              uploadedFiles.length === 0 || isUploading || !uploadForm.category
            }
            onClick={handleUpload}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default UploadDialog;
