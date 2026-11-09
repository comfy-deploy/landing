---
title: "Flux Fill Outpaint"
seoTitle: "Flux Fill Outpainting ComfyUI Workflow"
description: "Extend the borders of an image with Flux Fill Dev outpainting in ComfyUI. Upload a picture, describe the extension, and run it in the cloud on ComfyDeploy."
summary: "Extends an image past its original frame using flux1-fill-dev. Add a prompt that continues the scene and the workflow fills the new area to match."
family: "Flux"
tasks:
  - inpaint-outpaint
  - image-editing
inputs:
  - "Source image"
  - "Text prompt describing the extension"
outputs:
  - "Outpainted image with extended canvas"
useCases:
  - "Turning a square photo into a wide banner"
  - "Extending backgrounds for thumbnails or ads"
  - "Fixing tight crops"
  - "Adding more scene around a subject"
faq:
  - q: "What GPU does this Flux outpaint workflow need?"
    a: "It runs on an L40S on ComfyDeploy. It loads flux1-fill-dev with the t5xxl_fp16 text encoder."
  - q: "How should I prompt for outpainting?"
    a: "Describe what continues beyond the edges, such as the setting, lighting and architecture, and say to match the existing image."
  - q: "How do I run it as an API?"
    a: "Deploy it on ComfyDeploy and send an image and prompt to the endpoint. The extended image is returned."
---

## How it works

A LoadImage node brings in your picture, and ImageScaleToMaxDimension limits its size so the padded canvas stays manageable. ImagePadForOutpaint adds empty space around the image and creates a mask for the new area, with feathering to soften the seam.

The model is `flux1-fill-dev.safetensors`, loaded with a UNETLoader alongside a DualCLIPLoader (`clip_l.safetensors` and `t5xxl_fp16.safetensors`) and the `ae.safetensors` VAE. Your prompt goes through CLIPTextEncode and a FluxGuidance node.

InpaintModelConditioning combines the padded image, mask and prompt into latents, and a DifferentialDiffusion node lets the denoising follow the mask softly. KSampler generates the fill, VAEDecode converts it, and SaveImage writes the result.

## Tips

- Write the prompt as a continuation: describe the elements that should appear at the edges and say to keep the same lighting and atmosphere.
- Extend in moderate steps. Very large extensions give the model less context to match.
- Start with a sharp, well-lit source image since the fill copies its style.
- If a seam is visible, increase the feathering in ImagePadForOutpaint.

## Run it as an API

You can deploy this workflow on ComfyDeploy as a hosted API endpoint. The inputs listed above become the request fields, so your own app can submit them and receive the finished result without running ComfyUI yourself. The same workflow can also be run and shared from the ComfyDeploy playground in your browser.
