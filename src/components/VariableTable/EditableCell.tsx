import React, { useState, useEffect, useCallback } from 'react';
import { Input, Select, InputNumber, Form, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Variable, DataType } from '../../types';
import { validateDefaultValue, formatBoolValue, formatIntValue } from '../../utils/validation';

const { Option } = Select;

interface EditableCellProps {
  editing: boolean;
  dataIndex: keyof Variable;
  title: string;
  record: Variable;
  onSave: (index: number, dataIndex: keyof Variable, value: any) => boolean;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  record,
  onSave,
}) => {
  const [inputValue, setInputValue] = useState<any>(record[dataIndex]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setInputValue(record[dataIndex]);
    setError('');
  }, [record, dataIndex]);

  const handleSave = useCallback(() => {
    if (dataIndex === 'index') {
      return; // Index列只读
    }

    let valueToSave = inputValue;

    // 格式化值
    if (dataIndex === 'defaultValue') {
      if (record.dataType === DataType.BOOL) {
        valueToSave = formatBoolValue(inputValue);
      } else if (record.dataType === DataType.INT) {
        valueToSave = formatIntValue(inputValue);
      }
    }

    // 验证
    if (dataIndex === 'defaultValue') {
      const validation = validateDefaultValue(valueToSave, record.dataType);
      if (!validation.isValid) {
        setError(validation.message || 'Invalid value');
        return false;
      }
    } else if (dataIndex === 'name') {
      // 名称唯一性验证在父组件处理
      if (!valueToSave.trim()) {
        setError('Variable name cannot be empty');
        return false;
      }
    }

    const success = onSave(record.index, dataIndex, valueToSave);
    if (!success) {
      // 如果保存失败，显示错误（错误消息由store设置）
      setError('Save failed');
      return false;
    }

    setError('');
    return true;
  }, [dataIndex, inputValue, record, onSave]);

  const handleChange = (value: any) => {
    setInputValue(value);
    setError('');
  };

  const handleBlur = () => {
    if (editing) {
      handleSave();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editing) {
      handleSave();
    }
  };

  const renderInput = () => {
    if (dataIndex === 'index') {
      return <span>{record.index}</span>;
    }

    if (dataIndex === 'dataType') {
      return (
        <Select
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{ width: '100%' }}
        >
          <Option value={DataType.BOOL}>BOOL</Option>
          <Option value={DataType.INT}>INT</Option>
        </Select>
      );
    }

    if (dataIndex === 'defaultValue') {
      if (record.dataType === DataType.BOOL) {
        return (
          <Select
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ width: '100%' }}
          >
            <Option value="TRUE">TRUE</Option>
            <Option value="FALSE">FALSE</Option>
          </Select>
        );
      } else if (record.dataType === DataType.INT) {
        return (
          <InputNumber
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onPressEnter={handleKeyPress}
            style={{ width: '100%' }}
            min={-2147483648}
            max={2147483647}
            step={1}
          />
        );
      }
    }

    // 对于名称和注释，使用普通输入框
    return (
      <Input
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        onPressEnter={handleKeyPress}
        placeholder={dataIndex === 'name' ? 'Enter variable name' : 'Enter comment'}
      />
    );
  };

  if (!editing) {
    // 显示模式
    let displayValue = record[dataIndex];

    if (dataIndex === 'defaultValue' && record.dataType === DataType.BOOL) {
      displayValue = record.defaultValue.toUpperCase();
    }else if (dataIndex === 'comment') {
      displayValue = displayValue || '-'
    }
    return <div>{displayValue}</div>;
  }

  // 编辑模式
  return (
    <Form.Item
      style={{ margin: 0 }}
      validateStatus={error ? 'error' : ''}
      help={error}
    >
      <div style={{ position: 'relative' }}>
        {renderInput()}
        {error && (
          <Tooltip title={error}>
            <InfoCircleOutlined
              style={{
                color: '#ff4d4f',
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
          </Tooltip>
        )}
      </div>
    </Form.Item>
  );
};