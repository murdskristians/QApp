import {
  SmartSuiteSolution,
  SmartSuiteTable,
  SmartSuiteRecord,
  SmartSuiteRecordResponse,
  SmartSuiteListParams,
  SmartSuiteApiError,
} from '../types/smartsuite';

const BASE_URL = 'http://localhost:3001/api/smartsuite';

class SmartSuiteService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    console.log('[SmartSuite] Fetching:', url, options.method || 'GET');

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      console.log('[SmartSuite] Response:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: SmartSuiteApiError = {
          message: errorData.message || `API Error: ${response.status}`,
          status: response.status,
          details: errorData,
        };

        if (response.status === 401) {
          error.message = 'Invalid API token or unauthorized access';
        } else if (response.status === 429) {
          error.message = 'Rate limit exceeded. SmartSuite API has temporarily blocked your requests. Please wait 5-10 minutes before trying again.';
        } else if (response.status === 422) {
          error.message = 'Validation error. Please check your input data.';
        } else if (response.status === 404) {
          error.message = 'Resource not found';
        } else if (response.status === 500) {
          error.message = 'SmartSuite server error. Please try again in a few minutes.';
        }

        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error('[SmartSuite] Error:', error);

      if ((error as SmartSuiteApiError).status) {
        throw error;
      }

      const networkError: SmartSuiteApiError = {
        message: 'Network error or unable to connect to SmartSuite API',
        status: 0,
        details: error,
      };
      throw networkError;
    }
  }

  async listSolutions(): Promise<SmartSuiteSolution[]> {
    return this.request<SmartSuiteSolution[]>('/solutions/');
  }

  async listTables(): Promise<SmartSuiteTable[]> {
    return this.request<SmartSuiteTable[]>('/applications/');
  }

  async getTable(tableId: string): Promise<SmartSuiteTable> {
    return this.request<SmartSuiteTable>(`/applications/${tableId}/`);
  }

  async listRecords(
    tableId: string,
    params?: SmartSuiteListParams
  ): Promise<SmartSuiteRecordResponse> {
    const endpoint = `/applications/${tableId}/records/list/`;

    return this.request<SmartSuiteRecordResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify(params || {}),
    });
  }

  async getRecord(tableId: string, recordId: string): Promise<SmartSuiteRecord> {
    return this.request<SmartSuiteRecord>(
      `/applications/${tableId}/records/${recordId}/`
    );
  }

  async createRecord(
    tableId: string,
    data: Partial<SmartSuiteRecord>
  ): Promise<SmartSuiteRecord> {
    return this.request<SmartSuiteRecord>(
      `/applications/${tableId}/records/`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async updateRecord(
    tableId: string,
    recordId: string,
    data: Partial<SmartSuiteRecord>
  ): Promise<SmartSuiteRecord> {
    return this.request<SmartSuiteRecord>(
      `/applications/${tableId}/records/${recordId}/`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
  }

  async deleteRecord(tableId: string, recordId: string): Promise<void> {
    return this.request<void>(
      `/applications/${tableId}/records/${recordId}/`,
      {
        method: 'DELETE',
      }
    );
  }

  async bulkCreateRecords(
    tableId: string,
    records: Partial<SmartSuiteRecord>[]
  ): Promise<SmartSuiteRecord[]> {
    return this.request<SmartSuiteRecord[]>(
      `/applications/${tableId}/records/bulk/`,
      {
        method: 'POST',
        body: JSON.stringify({ items: records }),
      }
    );
  }

  isConfigured(): boolean {
    return true;
  }

  getConfig() {
    return {
      hasToken: true,
      hasWorkspaceId: true,
      baseUrl: BASE_URL,
    };
  }
}

export const smartSuiteService = new SmartSuiteService();
