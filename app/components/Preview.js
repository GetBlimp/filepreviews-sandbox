import bemify from 'lib/bemify'
import classNames from 'classnames'
import { size, isEmpty, parseInt } from 'lodash'
import React, { Component } from 'react'
import Icon from 'components/Icon'
import Loader from 'components/Loader'

const BEM = bemify('preview')

export default class Preview extends Component {
  render() {
    const { previewData, previewColor, isGeneratingPreview } = this.props

    return (
      <div className={BEM()} data-color={previewColor}>
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    const { previewData, isGeneratingPreview } = this.props

    if (isGeneratingPreview) {
      return (
        <Loader className={BEM('&loader')} width={54} height={56}/>
      )
    } else if (!isEmpty(previewData) && !previewData.error) {
      return (
        <div className={BEM('&image-wrapper')}>
          {this.renderPreview()}
          {this.renderActions()}
        </div>
      )
    } else {
      return null
    }
  }

  renderPreview() {
    const { thumbnails, currentThumbnail } = this.props
    const url = thumbnails[currentThumbnail]

    return url ? (
      <img src={url} width="auto" height="auto" className={BEM('&image')}/>
    ) : null
  }

  renderActions() {
    const { preview } = this.props.previewData

    const {
      thumbnails,
      nextThumbnail,
      prevThumbnail,
      currentThumbnail
    } = this.props

    return (
      <div className={BEM('&actions')}>
        <div className={BEM('&actions-left')}>
          {size(thumbnails) > 1 ? (
            <div className={BEM('&actions-thumbnail-actions')}>
              <button
                onClick={prevThumbnail}
                className="btn btn--icon-only">
                <Icon
                  name="prev"
                  width={18}
                  height={18}
                  viewBox="0 0 22 22"/>
              </button>
              <span className={BEM('&actions-thumbnail-index')}>
                {currentThumbnail + 1}
              </span>
              <button
                onClick={nextThumbnail}
                className="btn btn--icon-only">
                <Icon
                  name="next"
                  width={18}
                  height={18}
                  viewBox="0 0 22 22"/>
              </button>
            </div>
          ) : null}
        </div>
        <div className={BEM('&actions-right')}>
          <button
            title="Set the background to transparent"
            onClick={() => this.props.updatePreviewBackground('transparent')}
            data-action="setBgTransparent"/>
          <button
            title="Set the background to white"
            onClick={() => this.props.updatePreviewBackground('white')}
            data-action="setBgWhite"/>
          <button
            title="Set the background to black"
            onClick={() => this.props.updatePreviewBackground('black')}
            data-action="setBgBlack"/>
          <a
            href={!isEmpty(preview) ? preview.url : ''}
            target="_blank"
            title="View in full size"
            className="btn btn--icon-only"
            data-action="viewImageSource">
            <Icon name="source" width={12} height={18} viewBox="0 0 16 22"/>
          </a>
        </div>
      </div>
    )
  }
}
