import { useState, useEffect, useMemo } from 'react';
import {
  useSmartSuiteSolutions,
  useSmartSuiteTables,
  useSmartSuiteRecords,
  useSmartSuiteActions,
} from '../../hooks/useSmartSuite';
import { smartSuiteService } from '../../services/smartsuite';
import { SmartSuiteRecord } from '../../types/smartsuite';
import './SmartSuitePage.css';

interface FieldStructure {
  slug: string;
  label: string;
  field_type: string;
  params?: any;
}

export function SmartSuitePage() {
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SmartSuiteRecord | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [tableStructure, setTableStructure] = useState<FieldStructure[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: solutions, loading: loadingSolutions, error: solutionsError } = useSmartSuiteSolutions();
  const { data: tables, loading: loadingTables, error: tablesError } = useSmartSuiteTables();
  const { data: records, loading: loadingRecords, error: recordsError, refetch: refetchRecords } = useSmartSuiteRecords(selectedTable);
  const { createRecord, updateRecord, deleteRecord, loading: actionLoading } = useSmartSuiteActions();

  const config = smartSuiteService.getConfig();

  const filteredTables = tables?.filter(table => !selectedSolution || table.solution === selectedSolution) || [];

  // Fetch table structure when a table is selected
  useEffect(() => {
    if (selectedTable) {
      const currentTable = tables?.find(t => t.id === selectedTable);
      if (currentTable?.structure) {
        setTableStructure(currentTable.structure);
      }
    } else {
      setTableStructure([]);
    }
  }, [selectedTable, tables]);

  // Create field mapping from slug to label
  const fieldMap = useMemo(() => {
    const map: Record<string, string> = {};
    tableStructure.forEach(field => {
      map[field.slug] = field.label;
    });
    return map;
  }, [tableStructure]);

  // Get visible fields (first 5 non-system fields)
  const visibleFields = useMemo(() => {
    return tableStructure
      .filter(field => !field.params?.system)
      .slice(0, 5);
  }, [tableStructure]);

  const handleCreateRecord = async () => {
    if (!selectedTable) return;

    setFormError(null);
    try {
      await createRecord(selectedTable, formData);
      setShowCreateModal(false);
      setFormData({});
      setFormError(null);
      refetchRecords();
    } catch (error: any) {
      console.error('Failed to create record:', error);

      let fullErrorMessage = error?.message || 'Failed to create record';

      // Check if there are field-level errors in the response
      const errorDetails = error?.details;
      if (errorDetails && typeof errorDetails === 'object') {
        const fieldErrors: string[] = [];

        Object.entries(errorDetails).forEach(([key, value]) => {
          if (key !== 'message' && key !== 'status') {
            const errorText = Array.isArray(value) ? value.join(', ') : String(value);
            fieldErrors.push(`${key}: ${errorText}`);
          }
        });

        if (fieldErrors.length > 0) {
          fullErrorMessage = `${fullErrorMessage}\n\nField errors:\n${fieldErrors.join('\n')}`;
        }
      }

      setFormError(fullErrorMessage);
    }
  };

  const handleUpdateRecord = async () => {
    if (!selectedTable || !editingRecord) return;

    setFormError(null);
    try {
      await updateRecord(selectedTable, editingRecord.id, formData);
      setEditingRecord(null);
      setFormData({});
      setFormError(null);
      refetchRecords();
    } catch (error: any) {
      console.error('Failed to update record:', error);

      let fullErrorMessage = error?.message || 'Failed to update record';

      // Check if there are field-level errors in the response
      const errorDetails = error?.details;
      if (errorDetails && typeof errorDetails === 'object') {
        const fieldErrors: string[] = [];

        Object.entries(errorDetails).forEach(([key, value]) => {
          if (key !== 'message' && key !== 'status') {
            const errorText = Array.isArray(value) ? value.join(', ') : String(value);
            fieldErrors.push(`${key}: ${errorText}`);
          }
        });

        if (fieldErrors.length > 0) {
          fullErrorMessage = `${fullErrorMessage}\n\nField errors:\n${fieldErrors.join('\n')}`;
        }
      }

      setFormError(fullErrorMessage);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!selectedTable || !window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await deleteRecord(selectedTable, recordId);
      refetchRecords();
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  const handleEditClick = (record: SmartSuiteRecord) => {
    setFormError(null);
    setEditingRecord(record);
    setFormData({ ...record });
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setFormData({});
    setFormError(null);
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  if (!config.hasToken || !config.hasWorkspaceId) {
    return (
      <div className="smartsuite-page">
        <div className="smartsuite-error">
          <h2>SmartSuite Not Configured</h2>
          <p>Please configure your SmartSuite API credentials in the .env file:</p>
          <ul>
            <li>REACT_APP_SMARTSUITE_API_TOKEN</li>
            <li>REACT_APP_SMARTSUITE_WORKSPACE_ID</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="smartsuite-page">
      <header className="smartsuite-header">
        <h1>SmartSuite Integration</h1>
        <div className="smartsuite-status">
          <span className="status-indicator connected"></span>
          <span>Connected</span>
        </div>
      </header>

      <div className="smartsuite-content">
        <aside className="smartsuite-sidebar">
          <section className="smartsuite-section">
            <h3>Solutions</h3>
            {loadingSolutions ? (
              <div className="loading-text">Loading solutions...</div>
            ) : solutionsError ? (
              <div className="error-text">{solutionsError.message}</div>
            ) : (
              <ul className="smartsuite-list">
                {solutions?.map(solution => (
                  <li key={solution.id}>
                    <button
                      className={`smartsuite-list-item ${selectedSolution === solution.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedSolution(solution.id);
                        setSelectedTable(null);
                      }}
                    >
                      {solution.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="smartsuite-section">
            <h3>Tables</h3>
            {loadingTables ? (
              <div className="loading-text">Loading tables...</div>
            ) : tablesError ? (
              <div className="error-text">{tablesError.message}</div>
            ) : (
              <ul className="smartsuite-list">
                {filteredTables.map(table => (
                  <li key={table.id}>
                    <button
                      className={`smartsuite-list-item ${selectedTable === table.id ? 'active' : ''}`}
                      onClick={() => setSelectedTable(table.id)}
                    >
                      {table.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>

        <main className="smartsuite-main">
          {!selectedTable ? (
            <div className="smartsuite-empty">
              <p>Select a table to view records</p>
            </div>
          ) : (
            <>
              <div className="smartsuite-toolbar">
                <h2>Records</h2>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setFormError(null);
                    setShowCreateModal(true);
                  }}
                  disabled={actionLoading}
                >
                  Create Record
                </button>
              </div>

              {loadingRecords ? (
                <div className="loading-text">Loading records...</div>
              ) : recordsError ? (
                <div className="error-text">{recordsError.message}</div>
              ) : records && records.length > 0 ? (
                <div className="smartsuite-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        {visibleFields.map(field => (
                          <th key={field.slug}>{field.label}</th>
                        ))}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map(record => (
                        <tr key={record.id}>
                          <td>{record.id.slice(0, 8)}...</td>
                          {visibleFields.map(field => {
                            const value = record[field.slug];
                            let displayValue = '';

                            if (value === null || value === undefined) {
                              displayValue = '-';
                            } else if (typeof value === 'object') {
                              displayValue = JSON.stringify(value).slice(0, 50);
                            } else {
                              displayValue = String(value).slice(0, 50);
                            }

                            return (
                              <td key={field.slug}>{displayValue}</td>
                            );
                          })}
                          <td>
                            <div className="record-actions">
                              <button
                                className="btn-secondary"
                                onClick={() => handleEditClick(record)}
                                disabled={actionLoading}
                              >
                                Edit
                              </button>
                              <button
                                className="btn-danger"
                                onClick={() => handleDeleteRecord(record.id)}
                                disabled={actionLoading}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="smartsuite-empty">
                  <p>No records found</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {(showCreateModal || editingRecord) && (
        <div className="smartsuite-modal-overlay" onClick={() => {
          setShowCreateModal(false);
          handleCancelEdit();
        }}>
          <div className="smartsuite-modal" onClick={e => e.stopPropagation()}>
            <div className="smartsuite-modal-header">
              <h3>{editingRecord ? 'Edit Record' : 'Create Record'}</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowCreateModal(false);
                  handleCancelEdit();
                }}
              >
                ×
              </button>
            </div>
            <div className="smartsuite-modal-body">
              <p className="modal-hint">
                {editingRecord
                  ? 'Edit field values:'
                  : 'Enter values for the fields below. Only required and simple fields are shown to prevent validation errors.'}
              </p>
              {formError && (
                <div style={{
                  padding: '12px',
                  marginBottom: '16px',
                  backgroundColor: '#fee',
                  border: '1px solid #fcc',
                  borderRadius: '8px',
                  color: '#c33',
                  fontSize: '14px',
                  whiteSpace: 'pre-line'
                }}>
                  <strong>Error:</strong> {formError}
                </div>
              )}
              {tableStructure
                .filter(field => {
                  // Always exclude system fields and id
                  if (field.params?.system || field.slug === 'id') return false;

                  // When editing, show all fields
                  if (editingRecord) return true;

                  // When creating, only show required fields OR simple safe field types
                  const safeFieldTypes = [
                    'textfield',
                    'textareafield',
                    'numberfield',
                    'recordtitlefield'
                  ];

                  const isRequired = field.params?.required === true;
                  const isSafeType = safeFieldTypes.includes(field.field_type);

                  return isRequired || isSafeType;
                })
                .map(field => (
                  <div className="form-group" key={field.slug}>
                    <label>
                      {field.label}
                      {field.params?.required && <span style={{ color: 'red' }}> *</span>}
                      <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>
                        ({field.field_type})
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder={field.params?.placeholder || `Enter ${field.label.toLowerCase()}`}
                      value={
                        formData[field.slug] !== undefined && formData[field.slug] !== null
                          ? typeof formData[field.slug] === 'object'
                            ? JSON.stringify(formData[field.slug])
                            : String(formData[field.slug])
                          : ''
                      }
                      onChange={(e) => handleInputChange(field.slug, e.target.value)}
                    />
                    <small style={{ fontSize: '11px', color: '#666', marginTop: '4px', display: 'block' }}>
                      {field.field_type === 'linkedrecordfield' && 'Enter record ID or JSON array of IDs'}
                      {field.field_type === 'userfield' && 'Enter user ID or JSON array of user IDs'}
                      {field.field_type === 'datefield' && 'Enter date in format: YYYY-MM-DD'}
                      {field.field_type === 'currencyfield' && 'Enter number value'}
                      {field.field_type === 'numberfield' && 'Enter number value'}
                      {field.field_type === 'singleselectfield' && 'Enter option value'}
                      {field.field_type === 'multiselectfield' && 'Enter JSON array of values'}
                    </small>
                  </div>
                ))}
            </div>
            <div className="smartsuite-modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowCreateModal(false);
                  handleCancelEdit();
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={editingRecord ? handleUpdateRecord : handleCreateRecord}
                disabled={actionLoading}
              >
                {actionLoading ? 'Saving...' : editingRecord ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
