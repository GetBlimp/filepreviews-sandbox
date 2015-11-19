import 'babel/polyfill'
import 'styles/index.css'
import 'script!filepreviews/dist/filepreviews.js'

import React from 'react'
import ReactDOM from 'react-dom'
import { parseInt } from 'lodash'
import Sandbox from 'views/Sandbox'

window.FP_EMBED_SANDBOX = () => {
  const $boxes = document.querySelectorAll('.fp-sandbox')

  Array.prototype.forEach.call($boxes, ($box, index) => {
    ReactDOM.unmountComponentAtNode($box)

    const sandboxId = `fp-sandbox-${index}`

    const pages = $box.getAttribute('data-pages')
    const width = $box.getAttribute('data-size-width')
    const height = $box.getAttribute('data-size-height')
    const format = $box.getAttribute('data-format')
    const fileUrl = $box.getAttribute('data-file-url')
    const metadata = $box.getAttribute('data-metadata')
    const clientKey = $box.getAttribute('data-client-key')

    const serverKey = (
      $box.getAttribute('data-server-key') ||
      'XXXX-YOUR-SERVER-KEY-HERE-XXXX'
    )

    const serverSecretKey = (
      $box.getAttribute('data-server-secret-key') ||
      'XXXX-YOUR-SERVER-SECRET-KEY-HERE-XXXX'
    )

    $box.setAttribute('data-server-key', '')
    $box.setAttribute('data-server-secret-key', '')

    const props = {
      fileUrl,
      sandboxId,
      clientKey,
      serverKey,
      serverSecretKey,

      previewOptions: {
        pages: pages || 'all',
        format: format || 'png',
        metadata: metadata ? metadata.split(',') : [],

        size: width && height ? {
          width: parseInt(width),
          height: parseInt(height)
        } : {
          width: null,
          height: null
        }
      }
    }

    ReactDOM.render(<Sandbox id={sandboxId} {...props}/>, $box)
  })
}
