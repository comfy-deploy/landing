---
title: "Flux LoRAs Text-to-Image (Krea Dev)"
seoTitle: "Flux LoRA ComfyUI Workflow (Krea Dev)"
description: "Generate images with Flux Krea Dev and two stackable LoRAs, including Arcane and pixel art styles, using native ComfyUI nodes. Runs in the cloud on ComfyDeploy."
summary: "A minimal Flux text-to-image graph with two LoRA slots. It ships with an Arcane style LoRA and a pixel art LoRA you can swap for your own."
family: "Flux"
tasks:
  - "text-to-image"
inputs:
  - "Text prompt"
  - "Negative prompt"
outputs:
  - "Generated image"
useCases:
  - "Trying a style LoRA before using it in a larger pipeline"
  - "Pixel art game screens and sprites"
  - "Arcane-style character art"
  - "Testing your own trained Flux LoRA"
faq:
  - q: "What GPU does the Flux LoRA workflow need?"
    a: "The recommended GPU is the L40S. ComfyDeploy provisions it for you, so there is nothing to install."
  - q: "Can I use my own LoRA?"
    a: "Yes. Both LoRA slots use LoraLoaderModelOnly. Replace ARCANE_STYLE_FADOO-FLUX or Pixelart_-_FLUX with your own file and adjust the strength."
  - q: "How do I run the Flux LoRA workflow as an API?"
    a: "Deploy the workflow on ComfyDeploy and call the generated endpoint. The ComfyUIDeployExternal input and output nodes in the graph become the request and response fields."
---

## How it works

The graph is intentionally small, with 13 native nodes and no custom node packages. UNETLoader loads flux1-krea-dev, DualCLIPLoader loads clip_l and t5xxl_fp16, and VAELoader loads ae.safetensors.

Two LoraLoaderModelOnly nodes are chained after the model. The files shipped are ARCANE_STYLE_FADOO-FLUX.safetensors and Pixelart_-_FLUX.safetensors. Because they are model-only loaders, they change the diffusion model and leave the text encoder alone.

The positive prompt goes through CLIPTextEncode and FluxGuidance. The negative prompt goes through a second CLIPTextEncode, with FluxDisableGuidance applied to it. EmptyLatentImage sets the canvas, KSampler denoises, VAEDecode decodes and SaveImage writes the file.

The example prompt is a retro game-over screen with King Kong fighting Godzilla in pixel art. The example negative prompt lists cartoon, 3D render, blurry and similar terms.

## Tips

- Add the LoRA trigger words to your prompt if the LoRA needs them, such as pixelart for the pixel art file.
- Lower one LoRA strength to zero to test a single style, or use both at partial strength to blend them.
- Write a negative prompt that excludes the style you do not want, as the example does.
- Keep your own LoRAs in the same order and compare outputs with a fixed seed.
