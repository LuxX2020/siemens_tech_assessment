import React, { useState, useCallback, useMemo } from 'react';
import { Table, TableProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { Variable, DataType } from '../../types';
import { VariableStore } from '../../stores';
import { EditableCell } from './EditableCell';

interface VariableTableProps {
  store: VariableStore;
}


export const VariableTable: React.FC<VariableTableProps> = observer(({ store }) => {
  const [editingKey, setEditingKey] = useState<number | null>(null);

  const isEditing = useCallback(
    (record: Variable) => record.index === editingKey,
    [editingKey]
  );

  const handleSave = useCallback(
    (index: number, dataIndex: keyof Variable, value: any) => {
      let success = false;

      switch (dataIndex) {
        case 'name':
          success = store.updateVariableName(index, value);
          break;
        case 'dataType':
          success = store.updateVariableDataType(index, value as DataType);
          break;
        case 'defaultValue':
          success = store.updateVariableDefaultValue(index, value);
          break;
        case 'comment':
          success = store.updateVariableComment(index, value);
          break;
        default:
          break;
      }

      if (success) {
        setEditingKey(null);
      }

      return success;
    },
    [store]
  );

  // 需要展示的数据列
  const columns = useMemo(
    () => [
      {
        title: 'Index',
        dataIndex: 'index',
        key: 'index',
        width: 80,
        align: 'center',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        editable: true,
      },
      {
        title: 'Data Type',
        dataIndex: 'dataType',
        key: 'dataType',
        width: 120,
        editable: true,
      },
      {
        title: 'Default Value',
        dataIndex: 'defaultValue',
        key: 'defaultValue',
        width: 150,
        editable: true,
      },
      {
        title: 'Comment',
        dataIndex: 'comment',
        key: 'comment',
        editable: true
      },
    ],
    []
  );

  // 计算编辑时需要展示的数据列
  const mergedColumns = useMemo(
    () =>
      columns.map((col: any) => {
        if (!col.editable) {
          return col;
        }

        return {
          ...col,
          render: (value: any, record: Variable) => (
            <EditableCell 
              editing={isEditing(record)}
              dataIndex={col.dataIndex}
              record={record}
              onSave={handleSave}
              title={col.title}
            />),
        };
      }),
    [columns, isEditing, handleSave]
  );

  const rowSelection: TableProps<Variable>['rowSelection'] = {
    selectedRowKeys: store.selectedRowKeys,
    onChange: (selectedRowKeys) => {
      store.setSelectedRowKeys(selectedRowKeys as number[]);
    },
  };

  return (
    <Table<Variable>
      columns={mergedColumns}
      dataSource={store.variables}
      rowKey="index"
      rowSelection={rowSelection}
      onRow={(record) => ({
        onClick: () => setEditingKey(record.index),
      })}
      pagination={false}
      scroll={{ y: 400 }}
      size="middle"
      bordered
    />
  );
});