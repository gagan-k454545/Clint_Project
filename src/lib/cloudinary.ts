import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  file: Buffer | string,
  folder: string,
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto',
  options: Record<string, unknown> = {}
): Promise<{ url: string; publicId: string; thumbnailUrl?: string }> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: `pitchid/${folder}`,
      resource_type: resourceType,
      ...options,
    };

    const uploadCallback = (error: unknown, result: {secure_url: string; public_id: string; [key: string]: unknown} | undefined) => {
      if (error) return reject(error);
      if (!result) return reject(new Error('Upload failed'));

      let thumbnailUrl: string | undefined;
      if (resourceType === 'video') {
        // Generate thumbnail from video
        thumbnailUrl = cloudinary.url(result.public_id, {
          resource_type: 'video',
          format: 'jpg',
          transformation: [{ width: 400, height: 300, crop: 'fill' }, { quality: 80 }],
        });
      }

      resolve({
        url: result.secure_url,
        publicId: result.public_id,
        thumbnailUrl,
      });
    };

    if (typeof file === 'string') {
      // Base64 string
      cloudinary.uploader.upload(file, uploadOptions, uploadCallback);
    } else {
      // Buffer
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, uploadCallback);
      uploadStream.end(file);
    }
  });
}

export async function deleteFromCloudinary(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image') {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export default cloudinary;
