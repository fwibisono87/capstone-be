import Jimp from 'jimp';

export async function processImage(imageBuffer: Buffer, mimeType: string): Promise<Buffer> {
    try {
      // Read the image from the buffer
      const image = await Jimp.read(imageBuffer);
      // Resize the image to 224x224
      image.resize(224, 224);
      image.normalize();
  
      // Get the resized image buffer
      return await image.getBufferAsync(mimeType);
    } catch (error) {
      // Handle any errors that occur during image processing
      if (error instanceof Error) {
        throw new Error('Failed to process image: ' + error.message);
      } else {
        throw new Error('Unknown error occurred during image processing');
      }
    }
  }