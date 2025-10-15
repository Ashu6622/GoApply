export interface Application {
  id: string;
  userId: string;
  university: string;
  program: string;
  country: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected';
  progress: number;
  submittedDate?: string;
  deadline: string;
  applicationFee?: string;
  documents: string[];
  missingDocuments: string[];
  lastUpdate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewApplicationData {
  university: string;
  program: string;
  country: string;
  deadline: string;
  applicationFee?: string;
}