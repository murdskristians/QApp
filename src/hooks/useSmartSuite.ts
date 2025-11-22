import { useState, useEffect, useCallback } from 'react';
import { smartSuiteService } from '../services/smartsuite';
import {
  SmartSuiteSolution,
  SmartSuiteTable,
  SmartSuiteRecord,
  SmartSuiteListParams,
  SmartSuiteApiError,
} from '../types/smartsuite';

interface UseSmartSuiteState<T> {
  data: T | null;
  loading: boolean;
  error: SmartSuiteApiError | null;
}

export function useSmartSuiteSolutions() {
  const [state, setState] = useState<UseSmartSuiteState<SmartSuiteSolution[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchSolutions = useCallback(async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const solutions = await smartSuiteService.listSolutions();
      setState({ data: solutions, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error as SmartSuiteApiError,
      });
    }
  }, []);

  useEffect(() => {
    fetchSolutions();
  }, [fetchSolutions]);

  return { ...state, refetch: fetchSolutions };
}

export function useSmartSuiteTables() {
  const [state, setState] = useState<UseSmartSuiteState<SmartSuiteTable[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchTables = useCallback(async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const tables = await smartSuiteService.listTables();
      setState({ data: tables, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error as SmartSuiteApiError,
      });
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  return { ...state, refetch: fetchTables };
}

export function useSmartSuiteRecords(
  tableId: string | null,
  params?: SmartSuiteListParams
) {
  const [state, setState] = useState<UseSmartSuiteState<SmartSuiteRecord[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchRecords = useCallback(async () => {
    if (!tableId) {
      setState({ data: null, loading: false, error: null });

      return;
    }

    setState({ data: null, loading: true, error: null });

    try {
      const response = await smartSuiteService.listRecords(tableId, params);
      setState({ data: response.items, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error as SmartSuiteApiError,
      });
    }
  }, [tableId, params]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return { ...state, refetch: fetchRecords };
}

export function useSmartSuiteRecord(tableId: string | null, recordId: string | null) {
  const [state, setState] = useState<UseSmartSuiteState<SmartSuiteRecord>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchRecord = useCallback(async () => {
    if (!tableId || !recordId) {
      setState({ data: null, loading: false, error: null });

      return;
    }

    setState({ data: null, loading: true, error: null });

    try {
      const record = await smartSuiteService.getRecord(tableId, recordId);
      setState({ data: record, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error as SmartSuiteApiError,
      });
    }
  }, [tableId, recordId]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  return { ...state, refetch: fetchRecord };
}

export function useSmartSuiteActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SmartSuiteApiError | null>(null);

  const createRecord = useCallback(
    async (tableId: string, data: Partial<SmartSuiteRecord>) => {
      setLoading(true);
      setError(null);

      try {
        const record = await smartSuiteService.createRecord(tableId, data);
        setLoading(false);

        return record;
      } catch (err) {
        setError(err as SmartSuiteApiError);
        setLoading(false);

        throw err;
      }
    },
    []
  );

  const updateRecord = useCallback(
    async (tableId: string, recordId: string, data: Partial<SmartSuiteRecord>) => {
      setLoading(true);
      setError(null);

      try {
        const record = await smartSuiteService.updateRecord(tableId, recordId, data);
        setLoading(false);

        return record;
      } catch (err) {
        setError(err as SmartSuiteApiError);
        setLoading(false);

        throw err;
      }
    },
    []
  );

  const deleteRecord = useCallback(async (tableId: string, recordId: string) => {
    setLoading(true);
    setError(null);

    try {
      await smartSuiteService.deleteRecord(tableId, recordId);
      setLoading(false);
    } catch (err) {
      setError(err as SmartSuiteApiError);
      setLoading(false);

      throw err;
    }
  }, []);

  return {
    createRecord,
    updateRecord,
    deleteRecord,
    loading,
    error,
  };
}
