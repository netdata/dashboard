const path = require("path")

// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require("html-webpack-plugin")

const { APP_NAME, HTML_FILE_NAME } = process.env

const appFileName = APP_NAME || "App.tsx"

module.exports = {
  babel: {
    plugins: ["babel-plugin-styled-components"],
  },
  webpack: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    configure: (webpackConfig, { env, paths }) => {
      const [parser, tsLoader, loadersObject, ...rules] = webpackConfig.module.rules
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
          ? webpackConfig.plugins.map(plugin => {
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

        resolve: {
          ...webpackConfig.resolve,
          alias: {
            ...webpackConfig.resolve.alias,
            App: path.resolve(__dirname, `./src/${appFileName}`),
            "@/src": path.resolve(__dirname, "./src"),
            utils: path.resolve(__dirname, "./src/utils"),
            components: path.resolve(__dirname, "./src/components"),
            domains: path.resolve(__dirname, "./src/domains"),
            store: path.resolve(__dirname, "./src/store"),
            types: path.resolve(__dirname, "./src/types"),
            fonts: path.resolve(__dirname, "./src/fonts"),
            hooks: path.resolve(__dirname, "./src/hooks"),
            styles: path.resolve(__dirname, "./src/styles"),
            vendor: path.resolve(__dirname, "./src/vendor"),
            services: path.resolve(__dirname, "./src/services"),
            "dynamic-imports": path.resolve(__dirname, "./src/dynamic-imports"),
          },
        },
      }
    },
  },
}
