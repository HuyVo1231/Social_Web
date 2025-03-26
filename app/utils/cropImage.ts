export const getCroppedImg = async (imageSrc: string, crop: { x: number; y: number }) => {
  return {
    croppedUrl: imageSrc, // Giữ nguyên ảnh gốc
    crop: { x: crop.x, y: crop.y } // Chỉ lưu vị trí crop
  }
}
