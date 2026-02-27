class PcmCaptureProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];

    if (!input || input.length === 0) {
      return true;
    }

    const channelData = input[0];
    if (channelData && channelData.length > 0) {
      // Clone current frame to send to main thread for downsampling and PCM encoding.
      this.port.postMessage(new Float32Array(channelData));
    }

    // Pass-through to keep the node alive in the graph.
    if (output && output.length > 0) {
      output[0].set(channelData);
    }

    return true;
  }
}

registerProcessor("pcm-capture-processor", PcmCaptureProcessor);
