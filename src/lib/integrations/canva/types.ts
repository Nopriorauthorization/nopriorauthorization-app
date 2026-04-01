export type CanvaDesignSummary = {
  id: string;
  title: string;
  editUrl: string | null;
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CanvaExportFormat = "png" | "pdf";

export type CanvaExportJob = {
  designId: string;
  format: CanvaExportFormat;
  status: "pending" | "completed" | "failed" | "skipped";
  outputPaths?: string[];
  error?: string;
  httpStatus?: number;
};

export class CanvaServiceError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public canvaError?: string,
  ) {
    super(message);
    this.name = "CanvaServiceError";
  }
}
