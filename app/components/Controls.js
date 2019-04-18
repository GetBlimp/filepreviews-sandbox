import bemify from 'lib/bemify'
import validUrl from 'valid-url'
import filepicker from 'filepicker-js'
import { isNaN, parseInt } from 'lodash'
import React, { Component } from 'react'
import Icon from 'components/Icon'

const BEM = bemify('controls')

export default class Controls extends Component {
  componentDidMount() {
    filepicker.setKey(this.props.filePickerKey)
  }

  render() {
    return (
      <div className={BEM()}>
        {this.renderUploadButton()}
        {this.renderMetadataOptions()}
        {this.renderFormatOptions()}
        {this.renderDimensionsOptions()}
        {this.renderPagesOptions()}
        {this.renderGenerateButton()}
      </div>
    )
  }

  renderUploadButton() {
    return (
      <div className={BEM('&header')}>
        <strong className={BEM('&title')}>
          Enter a file url or upload a file
        </strong>
        <div className={BEM('&url-input-wrapper')}>
          <input
            type="text"
            value={this.props.fileUrl}
            onChange={::this.addFileUrl}
            className={BEM('&url-input')}
            placeholder="http://..."/>
          <button
            title="Upload a file"
            onClick={::this.showPicker}
            className="btn btn--icon-only"
            data-action="showFilePicker">
            <span>
              <Icon name="upload" width={22} height={15} viewBox="0 0 22 15"/>
            </span>
          </button>
        </div>
      </div>
    )
  }

  renderMetadataOptions() {
    const { metadata } = this.props.previewOptions

    return (
      <div className={BEM('&metadata')}>
        <strong className={BEM('&title')}>Metadata</strong>
        <div className={BEM('&row')}>
          <label className={BEM('&label')}>
            <input
              ref="ocrOption"
              type="checkbox"
              value="ocr"
              onChange={::this.onMetadataChange}
              className={BEM('&checkbox')}
              checked={metadata.includes('ocr')}/>
            <span className={BEM('&label-text')}>OCR</span>
          </label>
          <label className={BEM('&label')}>
            <input
              ref="psdOption"
              type="checkbox"
              value="psd"
              onChange={::this.onMetadataChange}
              className={BEM('&checkbox')}
              checked={metadata.includes('psd')}/>
            <span className={BEM('&label-text')}>PSD Layers</span>
          </label>
        </div>
        <div className={BEM('&row')}>
          <label className={BEM('&label')}>
            <input
              ref="exifOption"
              type="checkbox"
              value="exif"
              onChange={::this.onMetadataChange}
              className={BEM('&checkbox')}
              checked={metadata.includes('exif')}/>
            <span className={BEM('&label-text')}>EXIF</span>
          </label>
          <label className={BEM('&label')}>
            <input
              ref="multimediaOption"
              type="checkbox"
              value="multimedia"
              onChange={::this.onMetadataChange}
              className={BEM('&checkbox')}
              checked={metadata.includes('multimedia')}/>
            <span className={BEM('&label-text')}>Multimedia</span>
          </label>
        </div>
        <div className={BEM('&row')}>
          <label className={BEM('&label')}>
            <input
              ref="checksumOption"
              type="checkbox"
              value="checksum"
              onChange={::this.onMetadataChange}
              className={BEM('&checkbox')}
              checked={metadata.includes('checksum')}/>
            <span className={BEM('&label-text')}>Checksum</span>
          </label>
          <label className={BEM('&label')}>
            <input
              ref="webpageOption"
              type="checkbox"
              value="webpage"
              onChange={::this.onMetadataChange}
              className={BEM('&checkbox')}
              checked={metadata.includes('webpage')}/>
            <span className={BEM('&label-text')}>Webpage</span>
          </label>
        </div>
        <div className={BEM('&row')}>
          <label className={BEM('&label')}>
            <input
              ref="rawOption"
              type="checkbox"
              value="raw"
              onChange={::this.onMetadataChange}
              className={BEM('&checkbox')}
              checked={metadata.includes('raw')}/>
            <span className={BEM('&label-text')}>RAW</span>
          </label>
          <label className={BEM('&label')}>
            <input
              ref="sketchOption"
              type="checkbox"
              value="sketch"
              onChange={::this.onMetadataChange}
              className={BEM('&checkbox')}
              checked={metadata.includes('sketch')}/>
            <span className={BEM('&label-text')}>Sketch</span>
          </label>
        </div>
      </div>
    )
  }

  renderFormatOptions() {
    const { sandboxId, previewOptions } = this.props
    const { format } = previewOptions

    return (
      <div className={BEM('&formats')}>
        <strong className={BEM('&title')}>Output Format</strong>
        <div className={BEM('&row')}>
          <label className={BEM('&label')}>
            <input
              type="radio"
              name={`${sandboxId}-format`}
              value="png"
              checked={format === 'png'}
              onChange={::this.onFormatChange}
              className={BEM('&radio')}/>
            <span className={BEM('&label-text')}>.png</span>
          </label>
          <label className={BEM('&label')}>
            <input
              type="radio"
              name={`${sandboxId}-format`}
              value="webp"
              checked={format === 'webp'}
              onChange={::this.onFormatChange}
              className={BEM('&radio')}/>
            <span className={BEM('&label-text')}>.webp</span>
          </label>
        </div>
        <div className={BEM('&row')}>
          <label className={BEM('&label')}>
            <input
              type="radio"
              name={`${sandboxId}-format`}
              value="jpeg"
              checked={format === 'jpeg'}
              onChange={::this.onFormatChange}
              className={BEM('&radio')}/>
            <span className={BEM('&label-text')}>.jpeg</span>
          </label>
          <label className={BEM('&label')}>
            <input
              type="radio"
              name={`${sandboxId}-format`}
              value="jpg"
              checked={format === 'jpg'}
              onChange={::this.onFormatChange}
              className={BEM('&radio')}/>
            <span className={BEM('&label-text')}>.jpg</span>
          </label>
        </div>
      </div>
    )
  }

  renderDimensionsOptions() {
    const { size } = this.props.previewOptions

    return (
      <div className={BEM('&dimensions')}>
        <strong className={BEM('&title')}>Preview Dimensions</strong>
        <input
          ref="widthOption"
          type="text"
          value={size.width ? size.width.toString() : ''}
          onChange={::this.onSizeChange}
          className={BEM('&textfield')}
          placeholder="width"/>
        <span className={BEM('&textfield-divider')}/>
        <input
          ref="heightOption"
          type="text"
          value={size.height ? size.height.toString() : ''}
          onChange={::this.onSizeChange}
          className={BEM('&textfield')}
          placeholder="height"/>
      </div>
    )
  }

  renderPagesOptions() {
    const { sandboxId, previewOptions } = this.props
    const { pages } = previewOptions

    return (
      <div className={BEM('&pages')}>
        <strong className={BEM('&title')}>Pages</strong>
        <div className={BEM('&row')}>
          <label className={BEM('&label')}>
            <input
              type="radio"
              name={`${sandboxId}-pages`}
              value="all"
              checked={pages === 'all'}
              onChange={::this.onPagesChange}
              className={BEM('&radio')}/>
            <span className={BEM('&label-text')}>All</span>
          </label>
          <label className={BEM('&label')}>
            <input
              type="radio"
              name={`${sandboxId}-pages`}
              value={pages === 'all' ? '1' : pages}
              checked={pages !== 'all'}
              onChange={::this.onPagesChange}
              className={BEM('&radio')}/>
            <input
              ref="pagesRange"
              type="text"
              value={pages !== 'all' ? pages : ''}
              onChange={::this.onPagesChange}
              className={BEM('&textfield')}
              data-value="pages-range"
              placeholder="e.g. 5, 3-7"/>
          </label>
        </div>
      </div>
    )
  }

  renderGenerateButton() {
    return (
      <div className={BEM('&footer')}>
        <button
          onClick={this.props.generateFilePreview}
          className="btn"
          data-action="generatePreview">
          Generate preview
        </button>
      </div>
    )
  }

  showPicker() {
    filepicker.pick((inkBlob) => {
      if (inkBlob.url) {
        this.props.updateFileUrl(inkBlob.url)
      }
    })
  }

  addFileUrl(event) {
    const { value } = event.target

    if (validUrl.isWebUri(value)) {
      this.props.updateFileUrl(value)
    }
  }

  onMetadataChange() {
    const options = [
      this.refs.ocrOption,
      this.refs.psdOption,
      this.refs.exifOption,
      this.refs.multimediaOption,
      this.refs.checksumOption,
      this.refs.webpageOption,
      this.refs.rawOption,
      this.refs.sketchOption
    ]

    const metadata = options
      .filter(option => option.checked)
      .map(option => option.value)

    this.props.updateOptions({ metadata })
  }

  onFormatChange(event) {
    this.props.updateOptions({ format: event.target.value })
  }

  onSizeChange() {
    const width = parseInt(this.refs.widthOption.value)
    const height = parseInt(this.refs.heightOption.value)

    this.props.updateOptions({
      size: {
        width: isNaN(width) ? null : width,
        height: isNaN(height) ? null : height
      }
    })
  }

  onPagesChange(event) {
    const { value } = event.target

    if (value !== 'all') {
      this.refs.pagesRange.focus()
    }

    this.props.updateOptions({ pages: value })
  }
}
