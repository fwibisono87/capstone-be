import * as tf from '@tensorflow/tfjs-node';

function preprocessImage(imageBuffer: Buffer): tf.Tensor {
  const tensor = tf.node.decodeImage(imageBuffer, 3) as tf.Tensor3D;
  const resized = tf.image.resizeBilinear(tensor, [224, 224]);
  const normalized = resized.div(tf.scalar(255));
  const batched = normalized.expandDims(0);
  return batched;
}

export async function predictImage(imageBuffer: Buffer, modelPath: string) {
  const model = await tf.loadLayersModel(`file://${modelPath}`);
  const preprocessedImage = preprocessImage(imageBuffer);
  const prediction = model.predict(preprocessedImage) as tf.Tensor;
  
  // Convert the logits to probabilities with softmax if the model's final layer is not softmax
//   const probabilities = prediction.dataSync();
    const probabilities = tf.softmax(prediction).dataSync();

  
  const labels = [
    'Bika Ambon',
    'Kerak Telor',
    'Molen',
    'Nasi Goreng',
    'Papeda Maluku',
    'Sate Padang',
    'Seblak'
  ];

  const results: { [label: string]: number } = {};
  labels.forEach((label, i) => {
    results[label] = parseFloat(probabilities[i].toFixed(4));
  });

  return results;
}
