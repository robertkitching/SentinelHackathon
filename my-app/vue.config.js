module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:8888',
        changeOrigin: true
      },
    }
  },
  lintOnSave: false,
  transpileDependencies: [
    'vuetify'
  ]
}
