---
title: "Flux Krea Depth ControlNet (Native)"
seoTitle: "Flux Depth ControlNet ComfyUI Workflow"
description: "Restyle an image while keeping its structure using Depth Anything and a Flux union ControlNet with Flux Krea dev. Runs in the cloud on ComfyDeploy."
summary: "Upload an image and a prompt, and Flux Krea redraws the scene while the depth map keeps the layout intact. Good for heavy restyling that still respects the original composition."
family: "Flux"
tasks:
  - controlnet
  - image-editing
inputs:
  - "Source image"
  - "Text prompt"
outputs:
  - "Restyled image"
  - "Depth map preview"
useCases:
  - "Restyling a landscape or architecture shot while keeping its layout"
  - "Turning photos into fantasy or sci-fi scenes"
  - "Separating foreground and background changes by distance"
  - "Building a depth-guided image-to-image API"
faq:
  - q: "What GPU does the Flux depth ControlNet workflow need?"
    a: "The recommended GPU is an L40S. It runs flux1-krea-dev with t5xxl_fp16 plus a union ControlNet."
  - q: "Why use depth instead of Canny edges?"
    a: "Per the template description, depth maps separate elements by camera proximity, so you can change foreground and background differently while the structure stays the same."
  - q: "How do I run the Flux depth ControlNet as an API?"
    a: "Deploy it on ComfyDeploy and call the endpoint with the source image and your prompt. The generated output is returned from the API response."
---

## How it works

The graph uses only native nodes plus a preprocessor that ships with the ControlNet-aux set.

Your image is loaded and scaled with ImageScaleToMaxDimension. DepthAnythingPreprocessor, using depth_anything_vitl14.pth, converts it to a depth map. PreviewImage shows the map. A ControlNetLoader loads the Flux union ControlNet (diffusion_pytorch_model.safetensors), SetUnionControlNetType selects the depth mode, and ControlNetApplyAdvanced applies it to the positive and negative conditioning.

The base model is flux1-krea-dev.safetensors, loaded with UNETLoader, with clip_l and t5xxl_fp16 as encoders and ae.safetensors as the VAE. The positive prompt goes through FluxGuidance and the negative through FluxDisableGuidance. Because a VAEEncode node feeds the original image into the KSampler, this is image-to-image: the denoise setting decides how far the result can drift from the source.

The example prompt describes a temple scene layer by layer, from foreground rocks to midground to sky.

## Tips

- Write the prompt by depth layer, as the example does: foreground, midground, background.
- Lower the KSampler denoise to stay closer to the source, raise it for bigger changes.
- Check the PreviewImage depth map. If it looks noisy, use a cleaner or higher-resolution source.
- Tune the ControlNet strength in ControlNetApplyAdvanced if the structure is too rigid or too loose.
