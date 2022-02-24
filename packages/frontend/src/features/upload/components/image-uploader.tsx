// import React from 'react'
// import { Upload, Image } from 'antd'
// import { UploadProps } from 'antd/es/upload'
// import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
// import { reqUploadFile } from '@/services/common'
// import { useEffect } from 'react'

// export interface ImageUploadProps extends Omit<UploadProps, 'onChange'> {
//   value?: string
//   onChange?: (url: string) => void
// }

// const ImageUploader: React.FC<ImageUploadProps> = ({
//   onChange,
//   value,
//   ...rest
// }) => {
//   const [state, setState] = useImmer({
//     imgLoading: false,
//     imageUrl: value || '',
//   })
//   useEffect(() => {
//     if (value) {
//       setState((draft) => {
//         draft.imageUrl = value
//       })
//     }
//   }, [value])
//   const uploadButton = (
//     <div>
//       {state.imgLoading ? <LoadingOutlined /> : <PlusOutlined />}
//       <div style={{ marginTop: 8 }}>点击上传</div>
//     </div>
//   )
//   return (
//     <Upload
//       accept="image/png,image/jpg,image/jpeg,image/webp,image/gif"
//       name="files"
//       listType="picture-card"
//       showUploadList={false}
//       onChange={(info) => {
//         if (info.file.status === 'uploading') {
//           setState((draft) => {
//             draft.imgLoading = true
//           })
//           return
//         }
//         if (info.file.status === 'done') {
//           // Get this url from response in real world.
//           reqUploadFile({ file: info.file.originFileObj as File }).then(
//             (res) => {
//               if (res) {
//                 onChange && onChange(res.data)
//               }
//               setState((draft) => {
//                 draft.imgLoading = false
//               })
//             }
//           )
//         }
//       }}
//       {...rest}
//     >
//       {state.imageUrl ? (
//         <Image
//           src={state.imageUrl}
//           alt="cover"
//           width="100%"
//           height="100%"
//           preview={false}
//         />
//       ) : (
//         uploadButton
//       )}
//     </Upload>
//   )
// }

// export default ImageUploader
export default 1
