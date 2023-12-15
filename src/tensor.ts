import * as tf from '@tensorflow/tfjs-node';

// Assuming the image has already been resized to 224x224
// and is contained in the buffer in a format such as JPEG or PNG
function bufferToTensor(imageBuffer: Buffer): tf.Tensor3D {
    // Decode the image buffer into a tensor
    const tensor = tf.node.decodeImage(imageBuffer, 3) as tf.Tensor3D;

    // Normalize the image from [0, 255] to [0, 1]
    const normalized = tensor.div(255.0);

    // Add a batch dimension
    const batched = normalized.expandDims(0) as tf.Tensor3D;

    return batched;
}

// Function to load the model and make a prediction
async function makePrediction(imageBuffer: Buffer, modelPath: string): Promise<tf.Tensor> {
  const model = await tf.loadLayersModel(`file://${modelPath}`);
  const preprocessedImage = bufferToTensor(imageBuffer);
  return model.predict(preprocessedImage) as tf.Tensor;
}

// Example usage:
export async function predictImage(imageBuffer: Buffer, modelPath: string): Promise<{ [label: string]: number }> {
    try {
      const prediction = await makePrediction(imageBuffer, modelPath);
      const probabilities = await prediction.data() as Float32Array;
  
      // Define a mapping from indices to labels
      const labels = [
        'Bika Ambon',
        'Kerak Telor',
        'Molen',
        'Nasi Goreng',
        'Papeda Maluku',
        'Sate Padang',
        'Seblak'
      ];
  
      // Create a dictionary mapping labels to probabilities
      const results: { [label: string]: number } = {};
      labels.forEach((label, i) => {
        results[label] = probabilities[i];
      });
  
      return results;
    } catch (error) {
      console.error('Error predicting image:', error);
      throw error; // Rethrow the error to handle it outside of the function if needed
    }
  }
  

// Usage:
// You would pass the Buffer object directly from where you have it, for example:
// const imageBuffer = await fsPromises.readFile('path/to/your/image.jpg');
// predictImage(imageBuffer, 'static/makara_v1.2_tfjs/model.json');
