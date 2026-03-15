import React, { useState, useCallback } from 'react';
import { Button, Input, Space, Typography, Alert } from 'antd';
import { ImportOutlined, ExportOutlined, ClearOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { VariableStore } from '../../stores';

const { TextArea } = Input;
const { Text } = Typography;

interface ImportExportPanelProps {
  store: VariableStore;
}

export const ImportExportPanel: React.FC<ImportExportPanelProps> = observer(({ store }) => {
  const [importText, setImportText] = useState<string>('');

  const handleImport = useCallback(() => {
    if (!importText.trim()) {
      store.setErrorMessage('Please enter text to import');
      return;
    }

    const success = store.importFromText(importText);
    if (success) {
      setImportText('');
    }
  }, [importText, store]);

  const handleExport = useCallback(() => {
    const exportText = store.exportToText();
    setImportText(exportText);
    store.setSuccessMessage('Export successful');
  }, [store]);

  const handleClear = useCallback(() => {
    setImportText('');
    store.clearMessages();
  }, [store]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImportText(e.target.value);
    store.clearMessages();
  }, [store]);

  const exampleText = `VAR
  counter : INT := 42 // This is a counter
  flag : BOOL := TRUE
END_VAR`;

  return (
    <div className="import-export-section">
      <Typography.Title level={5}>Import/Export</Typography.Title>
      <Text type="secondary">
        Use standard variable definition format (VAR...END_VAR)
      </Text>

      <div className="textarea-container">
        <TextArea
          value={importText}
          onChange={handleTextChange}
          placeholder={`Example:\n${exampleText}`}
          rows={6}
        />
      </div>

      <div className="button-group">
        <Space>
          <Button
            type="primary"
            icon={<ImportOutlined />}
            onClick={handleImport}
          >
            Import
          </Button>
          <Button
            type="default"
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            type="default"
            icon={<ClearOutlined />}
            onClick={handleClear}
          >
            Clear
          </Button>
        </Space>
      </div>

      {store.errorMessage && (
        <Alert
          message="Error"
          description={store.errorMessage}
          type="error"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}

      {store.successMessage && (
        <Alert
          message="Success"
          description={store.successMessage}
          type="success"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
});