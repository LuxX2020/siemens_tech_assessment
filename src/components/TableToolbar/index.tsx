import React from 'react';
import { Button, Space, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { VariableStore } from '../../stores';

const { Text } = Typography;

interface TableToolbarProps {
  store: VariableStore;
}

export const TableToolbar: React.FC<TableToolbarProps> = observer(({ store }) => {
  const handleAddRow = () => {
    store.addVariable();
  };

  const handleDeleteRows = () => {
    store.deleteSelectedVariables();
  };

  const selectedCount = store.selectedVariables.length;

  return (
    <div className="table-toolbar">
      <div className="actions">
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRow}
          >
            Add Row
          </Button>
          <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteRows}
            disabled={selectedCount === 0}
          >
            Delete Rows
          </Button>
        </Space>
      </div>
      <div className="selection-info">
        {selectedCount > 0 && (
          <Text type="secondary">
            {selectedCount} rows selected
          </Text>
        )}
      </div>
    </div>
  );
});