const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');
const withSourceMaps = require('@zeit/next-source-maps');


module.exports = {
  webpack: (config, options) => {
    config = withSass({
      cssModules: true
    }).webpack(config, options);
    config = withSourceMaps(withCss({
      cssModules: false
    })).webpack(config, options);
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000
        }
      }
    });
    return config;
  }
}