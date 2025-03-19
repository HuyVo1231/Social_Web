import cloudinary from 'cloudinary'

cloudinary.v2.config({
  cloud_name: 'daz1udjeb',
  api_key: '692586855575142',
  api_secret: '_2MfEZB9hOuXENcRAGqx-30JvPQ'
})

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { file } = req.body

      // Upload file lên Cloudinary
      const result = await cloudinary.v2.uploader.upload(file, {
        upload_preset: 'your_upload_preset'
      })

      res.status(200).json({ url: result.secure_url })
    } catch (error) {
      console.error('Error uploading file:', error)
      res.status(500).json({ error: 'Failed to upload file' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
