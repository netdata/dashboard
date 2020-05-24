// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require("html-webpack-plugin")

const { HTML_FILE_NAME } = process.env

module.exports = {
  babel: {
    plugins: ["babel-plugin-styled-components"],
  },
  webpack: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    configure: (webpackConfig, { env, paths }) => {
      const [
        parser,
        tsLoader,
        loadersObject,
        ...rules
      ] = webpackConfig.module.rules
      const { oneOf } = loadersObject
      return {
        ...webpackConfig,
        module: {
          ...webpackConfig.module,
          rules: [
            parser,
            tsLoader,
            {
              oneOf: [
                {
                  test: /\.svg$/,
                  use: [
                    {
                      loader: "svg-sprite-loader",
                    },
                    "svgo-loader",
                  ],
                },
                ...oneOf,
              ],
            },
            ...rules,
          ],
        },
        plugins: HTML_FILE_NAME
          ? webpackConfig.plugins.map((plugin) => {
            if (plugin.constructor.name === "HtmlWebpackPlugin") {
              if (env === "development") {
                return new HtmlWebpackPlugin({
                  template: `./public/${HTML_FILE_NAME}`,
                })
              }
              // non-development environments generally don't use HTML_FILE_NAME
              // but i'm leaving the proper syntax in case we'll need it
              return new HtmlWebpackPlugin({
                inject: true,
                template: `./public/${HTML_FILE_NAME}`,
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              })
            }
            return plugin
          })
          : webpackConfig.plugins,
      }
    },
  },
}
