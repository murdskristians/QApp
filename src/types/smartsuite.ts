export interface SmartSuiteSolution {
  id: string;
  name: string;
  structure: string;
}

export interface SmartSuiteTable {
  id: string;
  name: string;
  structure: string;
  solution: string;
}

export interface SmartSuiteRecord {
  id: string;
  [key: string]: any;
}

export interface SmartSuiteRecordResponse {
  items: SmartSuiteRecord[];
  total_items?: number;
}

export interface SmartSuiteFilter {
  field: string;
  comparison: string;
  value: any;
}

export interface SmartSuiteSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SmartSuiteListParams {
  filter?: {
    operator: 'and' | 'or';
    fields: SmartSuiteFilter[];
  };
  sort?: SmartSuiteSort[];
  offset?: number;
  limit?: number;
}

export interface SmartSuiteApiError {
  message: string;
  status: number;
  details?: any;
}
