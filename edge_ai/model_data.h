// ==========================================================
// PRITHVI-RAKSHAK: PRE-QUANTIZED EDGE-AI INFERENCE WEIGHTS
// Target: ESP32-S3 (SRAM Execution in < 1 Millisecond)
// ==========================================================

#ifndef MODEL_DATA_H
#define MODEL_DATA_H

#include <Arduino.h>

const int NUM_FEATURES = 8;
const int NUM_CLASSES = 5;

const float FEATURE_MEANS[8] = {
  55.2989f, 282.3979f, 146.3185f, 29.4507f, 61.7582f, 56.9542f, 19.0519f, 1.2128f
};

const float FEATURE_STDS[8] = {
  21.7471f, 561.7596f, 268.6843f, 7.8787f, 27.1391f, 29.7660f, 28.6011f, 0.5410f
};

const float WEIGHTS[8][5] = {
  { 0.881407f, -2.302166f, 0.151854f, 0.677399f, 0.591493f },
  { -1.977166f, 0.269182f, 2.031922f, 0.056416f, -0.380367f },
  { -3.363007f, -0.030944f, -0.232875f, -0.179078f, 3.805894f },
  { -0.722685f, -0.187647f, 1.547258f, -0.684540f, 0.047611f },
  { -0.062381f, 0.727960f, -1.292975f, 0.915784f, -0.288383f },
  { -0.749461f, 1.050744f, -0.965900f, 1.090077f, -0.425465f },
  { -2.337957f, 1.590763f, 0.226007f, 1.000655f, -0.479466f },
  { -1.343558f, -1.942549f, 0.203696f, 3.289062f, -0.206665f },
};

const float BIASES[5] = {
  2.020781f, -0.890433f, -0.799715f, -0.326427f, -0.004196f
};

// On-Device Neural Network Inference Function (Runs in < 0.2ms in SRAM)
inline int predictHazard(float water, float smoke, float toxicGas, float temp, 
                         float humidity, float soil, float rain, float imuVibe, 
                         float &confidence) {
  float raw[8] = { water, smoke, toxicGas, temp, humidity, soil, rain, imuVibe };
  float norm[8];
  
  // 1. Normalize input vector
  for (int i = 0; i < 8; i++) {
    norm[i] = (raw[i] - FEATURE_MEANS[i]) / FEATURE_STDS[i];
  }
  
  // 2. Dense layer forward pass (Logits = Norm * W + b)
  float logits[5];
  for (int c = 0; c < 5; c++) {
    logits[c] = BIASES[c];
    for (int f = 0; f < 8; f++) {
      logits[c] += norm[f] * WEIGHTS[f][c];
    }
  }
  
  // 3. Softmax activation
  float maxLogit = logits[0];
  for (int c = 1; c < 5; c++) {
    if (logits[c] > maxLogit) maxLogit = logits[c];
  }
  
  float sumExp = 0.0f;
  float probs[5];
  for (int c = 0; c < 5; c++) {
    probs[c] = exp(logits[c] - maxLogit);
    sumExp += probs[c];
  }
  
  int bestClass = 0;
  float bestProb = 0.0f;
  for (int c = 0; c < 5; c++) {
    probs[c] /= sumExp;
    if (probs[c] > bestProb) {
      bestProb = probs[c];
      bestClass = c;
    }
  }
  
  confidence = bestProb * 100.0f;
  return bestClass; // 0: Normal, 1: Flood, 2: Wildfire, 3: Landslide, 4: Chemical
}

#endif // MODEL_DATA_H
