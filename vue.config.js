// module.exports = {
//   configureWebpack: {
//     resolve: {
//       alias: {
//         'assets': '@/assets',    
//         'common': '@/common',
//         'components': '@/components',
//         'network': '@/network',
//       }
//     }
//   }
// }
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
      }
    }
  },
  css: {
    extract: process.env.NODE_ENV !== 'development',
    sourceMap: false,
    requireModuleExtension: true,
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: [
          './src/theme'
        ]
      }
    }
  },
}
