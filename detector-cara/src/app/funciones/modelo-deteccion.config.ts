import * as faceapi from 'face-api.js';

export const faceDetectionNetSsdMobilenetv1Options = faceapi.nets.ssdMobilenetv1
export const faceDetectionNetTinyFaceDetectorOptions = faceapi.nets.tinyFaceDetector

// configuracion modelo SsdMobilenetv1Options
const minConfidence = 0.5

// configuracion modelo TinyFaceDetectorOptions
const inputSize = 512
const scoreThreshold = 0.3

function obtenerConfiguracionModeloTinyFaceDetectorOptions(net: faceapi.NeuralNetwork<any>) {  
  return net === faceapi.nets.tinyFaceDetector
    ? new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
    : new faceapi.SsdMobilenetv1Options({ minConfidence })
}

export const configuracionModeloTinyFaceDetectorOptions = obtenerConfiguracionModeloTinyFaceDetectorOptions(faceDetectionNetTinyFaceDetectorOptions)

function obtenerConfiguracionModeloSsdMobilenetv1Options(net: faceapi.NeuralNetwork<any>) {  
  return net === faceapi.nets.tinyFaceDetector
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })  
}

export const configuracionModeloSsdMobilenetv1Options = obtenerConfiguracionModeloSsdMobilenetv1Options(faceDetectionNetSsdMobilenetv1Options)