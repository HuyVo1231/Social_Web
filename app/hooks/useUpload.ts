export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'social_web')

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
    {
      method: 'POST',
      body: formData
    }
  )

  const data = await response.json()
  return data.secure_url
}
