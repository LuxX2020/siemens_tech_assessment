const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#1890ff', // 主色调
              '@border-radius-base': '4px', // 圆角
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};