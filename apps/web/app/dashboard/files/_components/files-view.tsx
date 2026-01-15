"use client";

import { api } from "@workspace/backend/_generated/api";
import type { PublicFile } from "@workspace/backend/private/files";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { TextShimmerWave } from "@workspace/ui/components/text-shimmer-wave";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { usePaginatedQuery } from "convex/react";
import { FileText, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteFileDialog from "./delete-file-dialog";
import UploadDialog from "./upload-dialog";

const FilesView = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteFileDialogOpen, setIsDeleteFileDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null);
  const handleDeleteClick = (file: PublicFile) => {
    setSelectedFile(file);
    setIsDeleteFileDialogOpen(true);
  };
  const handleFileDeleted = () => {
    setSelectedFile(null);
  };

  const files = usePaginatedQuery(
    api.private.files.listFiles,
    {},
    {
      initialNumItems: 10,
    }
  );

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingMore,
    isLoadingFirstPage,
  } = useInfiniteScroll({
    loadMore: files.loadMore,
    status: files.status,
    loadSize: 10,
  });

  return (
    <>
      <DeleteFileDialog
        open={isDeleteFileDialogOpen}
        onOpenChange={setIsDeleteFileDialogOpen}
        file={selectedFile}
        onDeleted={handleFileDeleted}
      />
      <UploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      />
      <div className="flex min-h-screen flex-col bg-muted p-8">
        <div className="mx-auto w-full max-w-screen-xl">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Knowledge Base</h1>
            <p>Upload and manage documents for your AI assistant</p>
          </div>
          <div className="mt-8 rounded-md border bg-background">
            <div className=" flex items-center justify-end border-b p-4">
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Plus />
                Upload File
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-4 font-medium">Name</TableHead>
                  <TableHead className="p-4 font-medium">Type</TableHead>
                  <TableHead className="p-4 font-medium">Size</TableHead>
                  <TableHead className="p-4 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  if (isLoadingFirstPage) {
                    return (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          <TextShimmerWave> Loading... </TextShimmerWave>
                        </TableCell>
                      </TableRow>
                    );
                  }
                  if (files.results.length === 0) {
                    return (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No files found
                        </TableCell>
                      </TableRow>
                    );
                  }

                  return files.results.map((file) => (
                    <TableRow key={file.id} className="hover:bg-muted/50">
                      <TableCell className="p-4">
                        <div className="flex items-center gap-2">
                          <FileText />
                          <span>{file.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <Badge variant="outline" className="font-mono">
                          <span>{file.type}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="text-muted-foreground">
                          <span>{file.size}</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon-sm">
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteClick(file)}
                            >
                              <Trash2 /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ));
                })()}
              </TableBody>
            </Table>
            {!isLoadingFirstPage && files.results.length > 0 && (
              <div className="border-t">
                <InfiniteScrollTrigger
                  ref={topElementRef}
                  canLoadMore={canLoadMore}
                  isLoadingMore={isLoadingMore}
                  onLoadMore={handleLoadMore}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default FilesView;
