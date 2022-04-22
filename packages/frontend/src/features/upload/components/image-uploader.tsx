import React, { useEffect, useState } from 'react'
import { Upload, Image } from 'antd'
import { UploadProps } from 'antd/es/upload'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { useUploadFileMutation } from '../upload.service'
import { isResolved } from '@/utils'

export interface ImageUploadProps extends Omit<UploadProps, 'onChange'> {
  value?: string
  onChange?: (url: string) => void
}

const ImageUploader: React.FC<ImageUploadProps> = ({
  onChange,
  value,
  ...rest
}) => {
  const [reqUploadFile] = useUploadFileMutation()
  const [imgLoading, setImgLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(value || '')

  useEffect(() => {
    if (value) {
      setImageUrl(value)
    }
  }, [value])
  const uploadButton = (
    <div>
      {imgLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>点击上传</div>
    </div>
  )
  return (
    <Upload
      disabled={imgLoading}
      accept="image/png,image/jpg,image/jpeg,image/webp,image/gif"
      name="files"
      beforeUpload={(file) => {
        setImgLoading(true)
        // Get this url from response in real world.
        reqUploadFile({ file })
          .then((res) => {
            if (isResolved(res)) {
              onChange && onChange(res.data.url)
            }
            setImgLoading(false)
          })
          .catch(() => {
            setImgLoading(false)
          })

        return false
      }}
      listType="picture-card"
      showUploadList={false}
      {...rest}
    >
      {imageUrl ? (
        <Image
          style={{ objectFit: 'cover' }}
          src={imageUrl}
          alt="cover"
          width="100%"
          height="100%"
          preview={false}
        />
      ) : (
        uploadButton
      )}
    </Upload>
  )
}

export default ImageUploader
