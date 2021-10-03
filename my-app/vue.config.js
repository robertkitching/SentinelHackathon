module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '././' : './',
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
