import React from 'react';
import { Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import { VariableTable, TableToolbar, ImportExportPanel } from './components';
import { VariableStore } from './stores';
import './styles/App.less';

const { Title } = Typography;

const variableStore = new VariableStore();

const App: React.FC = observer(() => {
  return (
    <div className="App">
      <div className="app-header">
        <Title level={2}>Variable Table Editor</Title>
      </div>

      <div className="app-content">
        <div className="table-section">
          <TableToolbar store={variableStore} />
          <VariableTable store={variableStore} />
        </div>
      </div>
    </div>
  );
});

export default App;
