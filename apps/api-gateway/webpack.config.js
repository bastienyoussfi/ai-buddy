const { composePlugins, withNx } = require('@nx/webpack');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), config => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`

  // Enable source maps in production
  config.devtool = 'source-map';

  // Handle TypeScript declaration files
  config.module = {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.d.ts$/,
        loader: 'ignore-loader',
      },
      {
        test: /\.js.map$/,
        loader: 'ignore-loader',
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  };

  // Configure externals to exclude problematic dependencies
  config.externals = [
    ...(config.externals || []),
    'mock-aws-s3',
    'aws-sdk',
    'nock',
    'bcrypt',
    'node-gyp',
    'npm',
    '@mapbox/node-pre-gyp',
    function ({ context, request }, callback) {
      if (
        /^(@nestjs\/microservices|@nestjs\/websockets|@nestjs\/platform-express)/.test(
          request,
        )
      ) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    },
  ];

  // Ignore warnings for certain modules
  config.ignoreWarnings = [
    {
      module: /node-pre-gyp|bcrypt/,
    },
    {
      module: /optional-require/,
    },
    {
      module: /load-package/,
    },
  ];

  return config;
});
