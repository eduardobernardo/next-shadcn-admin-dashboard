export type OperationsQueueStats = {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
};

export type OperationsVideoStatusSlice = {
  status: string;
  count: number;
};

export type OperationsStorageByOrganization = {
  organizationId: string;
  organizationName: string;
  totalBytes: number;
  mediaBytes: number;
  attachmentBytes: number;
  certificateBytes: number;
  videoCount: number;
  storageLimitBytes: number | null;
  usagePercent: number | null;
};

export type OperationsRecentJob = {
  mediaId: string;
  title: string | null;
  organizationId: string;
  organizationName: string;
  status: string;
  originalSizeBytes: number | null;
  processingStartedAt: string | null;
  processingEndedAt: string | null;
  processingError: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type OperationsOverview = {
  generatedAt: string;
  storageProvider: {
    bucket: string | null;
    region: string | null;
    source: string;
    note: string;
  };
  queue: OperationsQueueStats;
  videos: {
    total: number;
    uploadedLast30Days: number;
    processing: number;
    processed: number;
    failed: number;
    byStatus: OperationsVideoStatusSlice[];
  };
  storage: {
    totalBytes: number;
    mediaBytes: number;
    attachmentBytes: number;
    certificateBytes: number;
    byOrganization: OperationsStorageByOrganization[];
  };
  recentJobs: OperationsRecentJob[];
};
