---
title: "USO Subject and Style Transfer (Flux Krea)"
seoTitle: "USO Style Transfer ComfyUI Workflow with Flux Krea"
description: "Transfer subject and style from reference images with Flux Krea Dev and USO. Use it for style transfer or subject-driven generation on ComfyDeploy."
summary: "Upload a content image and style references, add a prompt, and USO generates a new image that keeps the subject and borrows the style."
family: "Flux"
tasks:
  - "image-editing"
  - "text-to-image"
inputs:
  - "Subject image"
  - "Style image(s)"
  - "Text prompt"
outputs:
  - "Generated image"
useCases:
  - "Applying a graphic design look to a photo"
  - "Keeping a character while changing its art style"
  - "Subject-driven generation with no style reference"
  - "Consistent branded visuals from a style sample"
faq:
  - q: "What GPU does the USO workflow need?"
    a: "The recommended GPU is the L40S. ComfyDeploy provisions it for you, so there is nothing to install."
  - q: "Can I use it without style images?"
    a: "Yes. The notes say you can disable all reference inputs and use the workflow for subject-driven generation."
  - q: "What does the largest_size setting do?"
    a: "It scales the reference image. The notes say 512px is the USO team recommendation to keep more character features, but 1024px works better for head-only inputs."
---

## How it works

The workflow uses flux1-krea-dev with clip_l, t5xxl_fp8_e4m3fn_scaled and ae.safetensors. USO (Unified Style and Subject-Driven Generation) is added with the uso-flux1-dit-lora-v1 LoRA through LoraLoaderModelOnly and the uso-flux1-projector-v1 file through ModelPatchLoader. The projector takes image features from CLIPVisionLoader using sigclip_vision_patch14_384.

Up to three LoadImage nodes supply the subject and style references. ImageScaleToMaxDimension controls the largest_size of the reference. Group nodes combine the references with the prompt, ConditioningZeroOut handles the negative conditioning, and KSampler runs 20 euler steps. VAEDecode and SaveImage output the picture.

An EasyCache node is included to skip some steps when the change between steps is small, which saves time. The notes say it can cost some quality and detail, and you can bypass it if you want maximum fidelity.

## Tips

- Use 512px for full-character references and 1024px for head-only crops.
- Bypass EasyCache for the best detail.
- Describe the style change in the prompt, such as geometric shapes and graphic design layouts.
- Fix the seed when you compare different style references.
