import path from 'path'
import express from 'express'
import webpack from 'webpack'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import webpackConfig from './webpack.config.dev.babel'

const app = express()
const compiler = webpack(webpackConfig)

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('X-HTTP-Method-Override'))

app.use('/assets', express.static(path.resolve(__dirname, 'assets'), {
  dotfiles: 'ignore'
}))

app.get('*', (req, res, next) => {
  if ((/api/).test(req.originalUrl)) {
    next()
  } else {
    res.sendFile(path.join(__dirname, 'index.html'))
  }
})

app.listen(3000, 'localhost', (error) => {
  if (error) {
    console.log(error)
    return
  }

  console.log('Listening at http://localhost:3000')
})
