---
title: "Qwen-Image-Edit with Lightning 8-Step LoRA"
seoTitle: "Qwen Image Edit ComfyUI Workflow (Native, Lightning)"
description: "Edit images with plain text instructions using Qwen-Image-Edit and the 8-step Lightning LoRA in native ComfyUI. Upload, describe, run on ComfyDeploy."
summary: "A native-node Qwen-Image-Edit graph that applies the Lightning 8-step LoRA for quick edits. Give it an image and an instruction like removing text or extending the scene."
family: "Qwen-Image"
tasks:
  - image-editing
inputs:
  - "Image to edit"
  - "Edit instruction prompt"
outputs:
  - "Edited image"
useCases:
  - "Removing UI text and overlays from screenshots"
  - "Extending or cleaning backgrounds"
  - "Style and object changes through text"
  - "Fast edit iterations with only 8 steps"
faq:
  - q: "What GPU does Qwen-Image-Edit need here?"
    a: "It is configured for an L40S on ComfyDeploy, with the fp8 qwen_image_edit model."
  - q: "Why is it fast?"
    a: "It applies Qwen-Image-Lightning-8steps-V1.1 as a LoRA, which is made for 8-step sampling."
  - q: "How do I run it as an API?"
    a: "Deploy it on ComfyDeploy and send an image and an instruction. The edited image is returned."
---

## How it works

A LoadImage node brings in the picture, and ImageScaleToTotalPixels resizes it to a working size. VAEEncode, using `qwen_image_vae.safetensors`, turns it into latents.

The edit model is `qwen_image_edit_fp8_e4m3fn.safetensors` in a UNETLoader. A LoraLoaderModelOnly adds `Qwen-Image-Lightning-8steps-V1.1-bf16.safetensors`, then ModelSamplingAuraFlow and CFGNorm prepare the model. The CLIPLoader loads `qwen_2.5_vl_7b_fp8_scaled.safetensors`.

Two TextEncodeQwenImageEdit nodes, one positive and one negative, encode the instruction together with the image so the model sees both. KSampler denoises, VAEDecode converts, and SaveImage stores the result. It uses only native ComfyUI nodes, 14 in total.

## Tips

- Write instructions as actions on the image, like removing all UI text and extending the image to match the surroundings.
- Keep sampling near 8 steps with the Lightning LoRA. More steps rarely help with a distilled LoRA.
- Large images are scaled down by ImageScaleToTotalPixels, so very high-resolution inputs lose detail unless you change that node.
- Chain edits one at a time for more predictable results.

## Run it as an API

You can deploy this workflow on ComfyDeploy as a hosted API endpoint. The inputs listed above become the request fields, so your own app can submit them and receive the finished result without running ComfyUI yourself. The same workflow can also be run and shared from the ComfyDeploy playground in your browser.

Because everything runs on cloud GPUs, you do not need to install the models yourself.
