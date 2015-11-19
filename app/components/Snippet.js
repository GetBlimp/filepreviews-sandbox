import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-elixir'
import 'prismjs/components/prism-php'
import bemify from 'lib/bemify'
import classNames from 'classnames'
import formatJSON from 'json-nice'
import { clone, isEmpty } from 'lodash'
import React, { Component } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Loader from 'components/Loader'

import {
  getJSCodeSample,
  getGoCodeSample,
  getRubyCodeSample,
  getPythonCodeSample,
  getElixirCodeSample,
  getPHPCodeSample
} from 'lib/codeSamples'

const BEM = bemify('snippet')

export default class Snippet extends Component {
  constructor(props) {
    super(props)
    this.languages = ['js', 'python', 'ruby', 'go', 'elixir', 'php']
  }

  render() {
    return (
      <div className={BEM()}>
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    const {
      previewData,
      snippetType,
      snippetLanguage,
      isGeneratingPreview
    } = this.props

    if (isGeneratingPreview) {
      return (
        <Loader className={BEM('&loader')} width={54} height={56}/>
      )
    } else if (!isEmpty(previewData)) {
      return (
        <div className={BEM('&wrapper')} data-snippet-type={snippetType}>
          {this.renderActions()}
          {this.renderResult()}
          <div
            className={BEM('&samples')}
            data-snippet-language={snippetLanguage}>
            {this.renderCodeSamples()}
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  renderActions() {
    const { snippetType, snippetLanguage, updateSnippetLanguage } = this.props

    const codeBtnClassNames = classNames({
      'btn': true,
      'btn--active': snippetType === 'code'
    })

    const resultBtnClassNames = classNames({
      'btn': true,
      'btn--active': snippetType === 'result'
    })

    return (
      <div className={BEM('&actions')}>
        <div className={BEM('&actions-left')}>
          <button
            title="Show result"
            onClick={() => this.props.updateSnippetType('result')}
            className={resultBtnClassNames}
            data-action="showResult">
            Result
          </button>
          <button
            title="Show code samples"
            onClick={() => this.props.updateSnippetType('code')}
            className={codeBtnClassNames}
            data-action="showCode">
            Code
          </button>
        </div>
        <div className={BEM('&actions-right')}>
          {snippetType === 'code' ? (
            <select
              value={snippetLanguage}
              onChange={event => updateSnippetLanguage(event.target.value)}
              className="select">
              <option value="node">Node</option>
              <option value="python">Python</option>
              <option value="ruby">Ruby</option>
              <option value="go">Go</option>
              <option value="elixir">Elixir</option>
              <option value="php">PHP</option>
            </select>
          ) : null}
        </div>
      </div>
    )
  }

  renderResult() {
    const { previewData, copyToClipboardText } = this.props
    const result = formatJSON(previewData)

    return previewData ? (
      <div className={BEM('&result-wrapper')}>
        <pre
          ref={::this.highlightCode}
          className={`${BEM('&result')} language-js`}>
          {result}
        </pre>
        <CopyToClipboard
          text={result}
          onCopy={this.props.updateClipboardText}>
          <button
            className="btn"
            data-action="copyCode">
            {copyToClipboardText}
          </button>
        </CopyToClipboard>
      </div>
    ) : null
  }

  renderCodeSamples() {
    const {
      fileUrl,
      serverKey,
      previewOptions,
      serverSecretKey,
      copyToClipboardText
    } = this.props

    const options = clone(previewOptions)
    const { size, metadata } = options

    if (size && (size.width === null || size.height === null)) {
      delete options.size
    }

    if (isEmpty(metadata)) {
      delete options.metadata
    }

    return this.languages.map((language) => {
      let codeSample

      switch (language) {
        case 'js': {
          codeSample = getJSCodeSample(
            serverKey, serverSecretKey, fileUrl, options
          )

          break
        }

        case 'python': {
          codeSample = getPythonCodeSample(
            serverKey, serverSecretKey, fileUrl, options
          )

          break
        }

        case 'ruby': {
          codeSample = getRubyCodeSample(
            serverKey, serverSecretKey, fileUrl, options
          )

          break
        }

        case 'go': {
          codeSample = getGoCodeSample(
            serverKey, serverSecretKey, fileUrl, options
          )

          break
        }

        case 'elixir': {
          codeSample = getElixirCodeSample(
            serverKey, serverSecretKey, fileUrl, options
          )

          break
        }

        case 'php': {
          codeSample = getPHPCodeSample(
            serverKey, serverSecretKey, fileUrl, options
          )

          break
        }
      }

      return codeSample ? (
        <div
          key={`code-sample-${language}`}
          className={BEM('&sample-wrapper')}
          data-language={language}>
          <pre
            ref={::this.highlightCode}
            className={`${BEM('&sample')} language-${language}`}>
            {codeSample}
          </pre>
          <CopyToClipboard
            text={codeSample}
            onCopy={this.props.updateClipboardText}>
            <button
              className="btn"
              data-action="copyCode">
              {copyToClipboardText}
            </button>
          </CopyToClipboard>
        </div>
      ) : null
    })
  }

  highlightCode(el) {
    if (el) {
      Prism.highlightElement(el)
    }
  }
}
