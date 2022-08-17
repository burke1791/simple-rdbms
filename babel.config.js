module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  plugins: [
    [
      'prismjs', {
        languages: ['sql'],
        theme: 'coy',
        css: true
      }
    ]
  ]
};