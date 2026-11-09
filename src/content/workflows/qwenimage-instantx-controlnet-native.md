---
title: "Qwen-Image InstantX ControlNet Union"
seoTitle: "Qwen-Image ControlNet ComfyUI Workflow (InstantX Union)"
description: "Guide Qwen-Image with a reference image using the InstantX ControlNet Union and a control image in native ComfyUI. Run it in the cloud on ComfyDeploy."
summary: "Use a reference image as structural guidance for a new Qwen-Image generation. The control image is applied through the InstantX ControlNet Union, with the Lightning 8-step LoRA for speed."
family: "Qwen-Image"
tasks:
  - controlnet
  - text-to-image
inputs:
  - "Reference image"
  - "Text prompt"
outputs:
  - "Generated image following the reference structure"
useCases:
  - "Redrawing a sketch or photo in a new art style"
  - "Keeping composition while changing subject or mood"
  - "Concept art from layout references"
  - "Style transfer that preserves pose and edges"
faq:
  - q: "What GPU does this Qwen-Image ControlNet workflow need?"
    a: "It is set to an L40S on ComfyDeploy. It loads qwen_image_fp8_e4m3fn."
  - q: "Which ControlNet does it use?"
    a: "Qwen-Image-InstantX-ControlNet-Union.safetensors, applied with a control image derived from your reference. The graph includes a Canny node and a depth model file (lotus-depth-d-v1-1)."
  - q: "Can I change the type of guidance?"
    a: "The Union ControlNet supports several control types, so you can change the preprocessor feeding ControlNetApplyAdvanced by editing the graph."
---

## How it works

A LoadImage node supplies the reference, and ImageScaleToTotalPixels resizes it. A Canny node (thresholds 0.1 and 0.2) and a PreviewImage node let you inspect edge extraction, and the graph also references a depth model, `lotus-depth-d-v1-1.safetensors`. ControlNetLoader loads `Qwen-Image-InstantX-ControlNet-Union.safetensors`, and ControlNetApplyAdvanced applies the control image at strength 1.0 to both positive and negative conditioning along with the VAE.

The base model is `qwen_image_fp8_e4m3fn.safetensors` through UNETLoader, with `qwen_2.5_vl_7b_fp8_scaled.safetensors` as the text encoder and `qwen_image_vae.safetensors` as the VAE. A LoraLoaderModelOnly adds `Qwen-Image-Lightning-8steps-V1.1-bf16.safetensors`, and ModelSamplingAuraFlow sets up sampling.

The reference is also VAE-encoded into a latent for the sampler. KSampler runs at CFG 1 with the Euler sampler, VAEDecode converts, and SaveImage stores the result. It uses native ComfyUI nodes only.

## Tips

- The control image decides the layout, so use references with clean, readable outlines.
- Prompt for style and content. The structure comes from the control image, so you do not need to describe the layout.
- Lower the ControlNet strength if the result looks too stiff, or raise it if the layout drifts.
- The notes include a long gouache-style example prompt to copy from.

## Run it as an API

You can deploy this workflow on ComfyDeploy as a hosted API endpoint. The inputs listed above become the request fields, so your own app can submit them and receive the finished result without running ComfyUI yourself. The same workflow can also be run and shared from the ComfyDeploy playground in your browser.
