import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditableCell } from '../../components/VariableTable/EditableCell';
import { DataType } from '../../types';

describe('EditableCell Component', () => {
  const mockRecord = {
    index: 1,
    name: 'testVar',
    dataType: DataType.BOOL,
    defaultValue: 'TRUE',
    comment: 'Test comment',
  };

  const mockOnSave = jest.fn(() => true);

  beforeEach(() => {
    mockOnSave.mockClear();
  });

  test('should render display mode', () => {
    render(
      <EditableCell
        editing={false}
        dataIndex="name"
        title="Name"
        record={mockRecord}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('testVar')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('should render edit mode for name', () => {
    render(
      <EditableCell
        editing={true}
        dataIndex="name"
        title="Name"
        record={mockRecord}
        onSave={mockOnSave}
      />
    );

    const input = screen.getByPlaceholderText('Enter variable name');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('testVar');
  });

  test('should render edit mode for data type', () => {
    render(
      <EditableCell
        editing={true}
        dataIndex="dataType"
        title="Data Type"
        record={mockRecord}
        onSave={mockOnSave}
      />
    );

    // Ant Design Select 渲染为隐藏的输入和下拉按钮
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('should render edit mode for BOOL default value', () => {
    render(
      <EditableCell
        editing={true}
        dataIndex="defaultValue"
        title="Default Value"
        record={mockRecord}
        onSave={mockOnSave}
      />
    );

    // BOOL 类型应该显示选择框
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('should render edit mode for INT default value', () => {
    const intRecord = { ...mockRecord, dataType: DataType.INT, defaultValue: '42' };

    render(
      <EditableCell
        editing={true}
        dataIndex="defaultValue"
        title="Default Value"
        record={intRecord}
        onSave={mockOnSave}
      />
    );

    // INT 类型应该显示数字输入框
    const input = screen.getByRole('spinbutton');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(42);
  });

  test('should render edit mode for comment', () => {
    render(
      <EditableCell
        editing={true}
        dataIndex="comment"
        title="Comment"
        record={mockRecord}
        onSave={mockOnSave}
      />
    );

    const input = screen.getByPlaceholderText('Enter comment');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Test comment');
  });

  test('should call onSave on blur', () => {
    render(
      <EditableCell
        editing={true}
        dataIndex="name"
        title="Name"
        record={mockRecord}
        onSave={mockOnSave}
      />
    );

    const input = screen.getByPlaceholderText('Enter variable name');
    fireEvent.change(input, { target: { value: 'newName' } });
    fireEvent.blur(input);

    expect(mockOnSave).toHaveBeenCalledWith(1, 'name', 'newName');
  });

  test('should call onSave on Enter key press', () => {
    render(
      <EditableCell
        editing={true}
        dataIndex="name"
        title="Name"
        record={mockRecord}
        onSave={mockOnSave}
      />
    );

    const input = screen.getByPlaceholderText('Enter variable name');
    fireEvent.change(input, { target: { value: 'newName' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });

    expect(mockOnSave).toHaveBeenCalledWith(1, 'name', 'newName');
  });

  test('should show error for invalid input', () => {
    mockOnSave.mockReturnValue(false);

    render(
      <EditableCell
        editing={true}
        dataIndex="name"
        title="Name"
        record={mockRecord}
        onSave={mockOnSave}
      />
    );

    const input = screen.getByPlaceholderText('Enter variable name');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(screen.getByText('Save failed')).toBeInTheDocument();
  });
});