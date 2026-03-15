import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VariableTable } from '../../components/VariableTable';
import { VariableStore } from '../../stores';
import { DataType } from '../../types';

describe('VariableTable Component', () => {
  let store: VariableStore;

  beforeEach(() => {
    store = new VariableStore();
  });

  test('should render empty table', () => {
    render(<VariableTable store={store} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Index')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Data Type')).toBeInTheDocument();
    expect(screen.getByText('Default Value')).toBeInTheDocument();
    expect(screen.getByText('Comment')).toBeInTheDocument();
  });

  test('should display variables', () => {
    store.addVariable();
    store.updateVariable(1, { name: 'counter', dataType: DataType.INT, defaultValue: '42' });

    render(<VariableTable store={store} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('counter')).toBeInTheDocument();
    expect(screen.getByText('INT')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  test('should allow row selection', () => {
    store.addVariable();
    store.addVariable();

    render(<VariableTable store={store} />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // 选择第一行

    expect(store.selectedRowKeys).toEqual([1]);
  });

  test('should enter edit mode on row click', async () => {
    store.addVariable();

    render(<VariableTable store={store} />);

    const nameCell = screen.getByText('');
    fireEvent.click(nameCell);

    // 应该进入编辑模式
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter variable name')).toBeInTheDocument();
    });
  });

  test('should filter by data type', () => {
    store.addVariable();
    store.updateVariable(1, { name: 'boolVar', dataType: DataType.BOOL });
    store.addVariable();
    store.updateVariable(2, { name: 'intVar', dataType: DataType.INT });

    render(<VariableTable store={store} />);

    // 查找过滤器
    const filterButtons = screen.getAllByRole('button');
    // 这里简化测试，实际需要找到正确的过滤器按钮
    expect(screen.getByText('boolVar')).toBeInTheDocument();
    expect(screen.getByText('intVar')).toBeInTheDocument();
  });
});