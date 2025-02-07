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
    ],
  };

  // Configure externals properly
  config.externals = [
    function (context, request, callback) {
      if (
        [
          '@nestjs/microservices',
          '@nestjs/websockets',
          '@nestjs/platform-express',
          'cache-manager',
          'class-transformer',
          'class-validator',
          '@grpc/grpc-js',
          '@grpc/proto-loader',
          'amqp-connection-manager',
          'nats',
          'kafkajs',
          'mqtt',
          '@mikro-orm/core',
          '@nestjs/mongoose',
          '@nestjs/sequelize',
          '@nestjs/typeorm',
        ].includes(request)
      ) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    },
  ];

  return config;
});
