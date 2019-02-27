import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { convertToRaw } from 'draft-js'
import mediumDraftImporter from 'medium-draft/lib/importer'
import mediumDraftExporter from 'medium-draft/lib/exporter'
import { createEditorState } from 'medium-draft'
import Editor from './Editor'
import InsightEditorBottom from './InsightEditorBottom'
import InsightEditorTitle from './InsightEditorTitle'
import { sanitizeMediumDraftHtml } from '../../utils/utils'
import styles from './InsightsEditor.module.scss'

class InsightsEditor extends Component {
  static propTypes = {
    updateDraft: PropTypes.func
  }

  static defaultProps = {
    title: '',
    text: '',
    tags: [],
    updateDraft: () => {}
  }

  defaultEditorContent = convertToRaw(mediumDraftImporter(this.props.text))

  state = {
    title: this.props.title,
    textEditorState: createEditorState(this.defaultEditorContent),
    tags: this.props.tags,
    editing: false
  }

  onTitleChange = title => {
    this.setState(
      {
        title,
        editing: true
      },
      this.updateDraft
    )
  }

  onTextChange = textEditorState => {
    const currentContent = textEditorState.getCurrentContent()
    if (
      mediumDraftExporter(currentContent) ===
      mediumDraftExporter(this.state.textEditorState.getCurrentContent())
    ) {
      return
    }

    this.setState(
      {
        textEditorState,
        editing: true
      },
      () => this.updateDraft(currentContent)
    )
  }

  onTagsChange = tags => {
    this.setState({ tags, editing: true }, this.updateDraft)
  }

  isTitleAndTextOk () {
    const { title, textEditorState } = this.state

    const trimmedTitle = title.trim()
    const trimmedText = textEditorState
      .getCurrentContent()
      .getPlainText()
      .trim()

    console.log(trimmedTitle, trimmedText)

    return trimmedTitle.length > 5 && trimmedText.length > 5
  }

  // NOTE(vanguard): Maybe should be placed in the InsightsEditorPage?
  updateDraft = debounce(
    (currentContent = this.state.textEditorState.getCurrentContent()) => {
      const { title, tags } = this.state
      const { readyState } = this.props

      if (readyState === 'published' || !this.isTitleAndTextOk()) {
        return
      }

      const currentHtml = mediumDraftExporter(currentContent)
      const { id, updateDraft } = this.props

      updateDraft({
        id,
        title,
        text: sanitizeMediumDraftHtml(currentHtml),
        tags
      })

      this.setState(prevState => ({ ...prevState, editing: false }))
    },
    1000
  )

  render () {
    const { title, text, tags, updatedAt, updating } = this.props
    const { editing } = this.state

    return (
      <div className={styles.wrapper}>
        <InsightEditorTitle
          defaultValue={title}
          onChange={this.onTitleChange}
        />
        <Editor
          defaultEditorContent={this.defaultEditorContent}
          placeholder='Write something interesting here...'
          onChange={this.onTextChange}
        />
        <InsightEditorBottom
          defaultTags={tags}
          updatedAt={updatedAt}
          onTagsChange={this.onTagsChange}
          isPublishDisabled={editing || updating || !this.isTitleAndTextOk()}
        />
      </div>
    )
  }
}

export default InsightsEditor
