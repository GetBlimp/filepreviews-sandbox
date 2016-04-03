import React, { Component } from 'react'

import {
  map,
  size,
  clone,
  first,
  extend,
  isEmpty,
  flatten,
  compact
} from 'lodash'

import Preview from 'components/Preview'
import Snippet from 'components/Snippet'
import Controls from 'components/Controls'

export default class Sandbox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fileUrl: props.fileUrl,
      thumbnails: [],
      previewData: {},
      snippetType: 'result',
      previewColor: 'transparent',
      snippetLanguage: 'node',
      currentThumbnail: 0,
      isGeneratingPreview: false,
      copyToClipboardText: 'Copy to Clipboard',

      previewOptions: {
        size: props.previewOptions.size,
        pages: props.previewOptions.pages,
        format: props.previewOptions.format,
        metadata: props.previewOptions.metadata,

        uploader: {
          headers: {
            'x-amz-acl': 'public-read',
            'Cache-Control': 'max-age=315360000, no-transform, private'
          }
        }
      }
    }

    if (!props.clientKey) {
      throw new Error('No FilePreviews Client Key provided.')
    }

    this.preview = new FilePreviews({
      apiKey: props.clientKey,
      apiUrl: props.clientApiUrl
    })

    this.FilePreviewsInterval = null
  }

  render() {
    return (
      <div className="sandbox">
        <Controls
          fileUrl={this.state.fileUrl}
          sandboxId={this.props.sandboxId}
          filePickerKey={this.props.filePickerKey}
          previewOptions={this.state.previewOptions}
          updateOptions={::this.updateOptions}
          updateFileUrl={::this.updateFileUrl}
          generateFilePreview={::this.generateFilePreview}/>
        <Preview
          thumbnails={this.state.thumbnails}
          previewData={this.state.previewData}
          previewColor={this.state.previewColor}
          currentThumbnail={this.state.currentThumbnail}
          isGeneratingPreview={this.state.isGeneratingPreview}
          prevThumbnail={::this.prevThumbnail}
          nextThumbnail={::this.nextThumbnail}
          updatePreviewBackground={::this.updatePreviewBackground}/>
        <Snippet
          fileUrl={this.state.fileUrl}
          clientKey={this.props.clientKey}
          serverKey={this.props.serverKey}
          previewData={this.state.previewData}
          snippetType={this.state.snippetType}
          previewOptions={this.state.previewOptions}
          snippetLanguage= {this.state.snippetLanguage}
          serverSecretKey={this.props.serverSecretKey}
          isGeneratingPreview={this.state.isGeneratingPreview}
          copyToClipboardText={this.state.copyToClipboardText}
          updateSnippetType={::this.updateSnippetType}
          updateClipboardText={::this.updateClipboardText}
          updateSnippetLanguage={::this.updateSnippetLanguage}/>
      </div>
    )
  }

  updateOptions(options) {
    this.setState({
      previewOptions: extend({}, this.state.previewOptions, options)
    });
  }

  updateFileUrl(fileUrl) {
    this.setState({ fileUrl })
  }

  generateFilePreview() {
    const { fileUrl, previewOptions } = this.state
    const options = clone(previewOptions, true)

    clearInterval(this.FilePreviewsInterval)

    if (!options.size.width || !options.size.height) {
      delete options.size
    }

    this.setState({ isGeneratingPreview: true }, () => {
      this.preview.generate(fileUrl, options, (error, result) => {
        if (isEmpty(error)) {
          this.FilePreviewsInterval = setInterval(() => {
            this.preview.retrieve(result.id, (error, result) => {
              if (result.status !== 'pending' && result.status !== 'started') {
                clearInterval(this.FilePreviewsInterval)

                this.setState({
                  thumbnails: this.getThumbnails(result),
                  previewData: !isEmpty(error) ? error : result,
                  isGeneratingPreview: false
                })
              }
            })
          }, 5000)
        } else {
          this.setState({
            thumbnails: [],
            previewData: error,
            isGeneratingPreview: false
          })
        }
      })
    })
  }

  getThumbnails(result) {
    const preview = first(result.thumbnails) || {}
    const original = result.original_file || {}

    let thumbnails = []

    if (original.metadata &&
      original.metadata.psd &&
      original.metadata.psd.layers &&
      !isEmpty(original.metadata.psd.layers)) {
      thumbnails = compact(
        flatten([
          preview.url,
          map(original.metadata.psd.layers, (layer) => layer.url)
        ])
      )
    } else if (original.metadata &&
      original.metadata.webpage &&
      !isEmpty(original.metadata.webpage.images)) {
      thumbnails = compact(
        flatten([
          preview.url,
          map(original.metadata.webpage.images, (image) => image.src)
        ])
      )
    } else if (!isEmpty(result.thumbnails)) {
      thumbnails = map(result.thumbnails, (thumb) => thumb.url)
    } else {
      thumbnails = [result.preview ? result.preview.url : '']
    }

    return thumbnails
  }

  updatePreviewBackground(color) {
    this.setState({ previewColor: color })
  }

  updateSnippetType(type) {
    this.setState({ snippetType: type })
  }

  updateSnippetLanguage(language) {
    this.setState({ snippetLanguage: language })
  }

  updateClipboardText() {
    if (this.state.copyToClipboardText === 'Copy to Clipboard') {
      this.setState({ copyToClipboardText: 'Copied!' }, () => {
        setTimeout(() => {
          this.setState({ copyToClipboardText: 'Copy to Clipboard' })
        }, 1000)
      })
    }
  }

  prevThumbnail() {
    const { thumbnails, previewData, currentThumbnail } = this.state
    const nextThumbnail = currentThumbnail - 1

    this.setState({
      currentThumbnail: (
        nextThumbnail < 0 ? (size(thumbnails) - 1) : nextThumbnail
      )
    })
  }

  nextThumbnail() {
    const { thumbnails, previewData, currentThumbnail } = this.state
    const nextThumbnail = currentThumbnail + 1

    this.setState({
      currentThumbnail: (
        nextThumbnail > (size(thumbnails) - 1) ? 0 : nextThumbnail
      )
    })
  }
}
