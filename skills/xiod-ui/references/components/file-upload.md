# FileUpload

```tsx
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentGroup, AttachmentMedia, AttachmentTitle, AttachmentTrigger, FileUpload, FileUploadInput, FileUploadItem, FileUploadItemIcon, FileUploadItemName, FileUploadItemProgress, FileUploadItemRemove, FileUploadItemSize, FileUploadItemStatus, FileUploadList, FileUploadTrigger } from "xiod-ui/file-upload";
```

## Attachment

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| orientation | `"horizontal" \| "vertical" \| null \| undefined` | `"horizontal"` |
| size | `"sm" \| "default" \| "xs" \| null \| undefined` | `"default"` |
| state | `AttachmentState \| undefined` | `"done"` |

## AttachmentAction

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| size | `"sm" \| "default" \| "lg" \| "xs" \| "xl" \| "icon" \| "icon-lg" \| "icon-sm" \| "icon-xl" \| "icon-xs" \| null \| undefined` | `"icon-xs"` |
| variant | `"link" \| "default" \| "secondary" \| "destructive" \| "destructive-outline" \| "ghost" \| "outline" \| null \| undefined` | — |

## AttachmentActions

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## AttachmentContent

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## AttachmentDescription

Renders a `<span>` and takes its props. Pass `render` to render a different element.

## AttachmentGroup

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## AttachmentMedia

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| variant | `"image" \| "icon" \| null \| undefined` | `"icon"` |

## AttachmentTitle

Renders a `<span>` and takes its props. Pass `render` to render a different element.

## AttachmentTrigger

Renders a `<button>` and takes its props. Pass `render` to render a different element.

## FileUpload

| Prop | Type | Default |
| :--- | :--- | :--- |
| accept | `string \| undefined` | — |
| children | `ReactNode` | — |
| disabled | `boolean \| undefined` | `false` |
| files | `FileItem[] \| undefined` | — |
| maxFiles | `number \| undefined` | `5` |
| maxSizeMB | `number \| undefined` | `10` |
| onFileRemove | `((id: string) => void) \| undefined` | — |
| onFilesAdded | `((files: File[]) => void) \| undefined` | — |
| onFilesChange | `((files: FileItem[]) => void) \| undefined` | — |

## FileUploadInput

Renders a `<input>` and takes its props.

## FileUploadItem

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| **fileItem** | `FileItem` |

## FileUploadItemIcon

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## FileUploadItemName

Renders a `<p>` and takes its props. Pass `render` to render a different element.

## FileUploadItemProgress

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## FileUploadItemRemove

Renders a `<button>` and takes its props. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| icon | `ReactNode` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## FileUploadItemSize

Renders a `<span>` and takes its props. Pass `render` to render a different element.

## FileUploadItemStatus

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## FileUploadList

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## FileUploadTrigger

Renders a `<div>` and takes its props. Pass `render` to render a different element.

Required props are bold. Full docs: https://ui.xiod.dev/docs
