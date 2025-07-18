import { RichText as RichTextConverter } from '@payloadcms/richtext-lexical/react'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Props = {
  data: SerializedEditorState
} & React.HTMLAttributes<HTMLDivElement>

function RichText(props: Props) {
  const { className, ...rest } = props
  return <RichTextConverter {...rest} className={className} />
}
export { RichText }
