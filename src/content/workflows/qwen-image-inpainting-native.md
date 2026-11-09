---
title: "Qwen-Image Inpainting (ControlNet, Lightning)"
seoTitle: "Qwen-Image Inpainting ComfyUI Workflow"
description: "Paint a mask on any image and refill it from a text prompt with Qwen-Image, the InstantX inpainting ControlNet and the 8-step Lightning LoRA on ComfyDeploy."
summary: "Load an image, paint a mask over the area to change, and describe what should appear there. Eight Lightning steps keep it quick."
family: "Qwen-Image"
tasks:
  - "inpaint-outpaint"
  - "image-editing"
inputs:
  - "Image with painted mask"
  - "Text prompt"
outputs:
  - "Inpainted image"
useCases:
  - "Replacing or removing objects in a photo"
  - "Adding accessories or clothing to a character"
  - "Fixing small defects in generated images"
  - "Changing one region of an illustration"
faq:
  - q: "What GPU does Qwen-Image inpainting need?"
    a: "The recommended GPU is the L40S. ComfyDeploy provisions it for you, so there is nothing to install."
  - q: "How do I draw the mask?"
    a: "Right-click the Load Image node and choose Open in MaskEditor, then paint over the area you want to change."
  - q: "How do I run Qwen-Image inpainting as an API?"
    a: "Deploy the workflow on ComfyDeploy and call the generated endpoint. The ComfyUIDeployExternal input and output nodes in the graph become the request and response fields."
---

## How it works

This is a native ComfyUI graph with 16 nodes and no custom packages. UNETLoader loads qwen_image_fp8_e4m3fn, CLIPLoader loads qwen_2.5_vl_7b_fp8_scaled and VAELoader loads qwen_image_vae. A LoraLoaderModelOnly node applies Qwen-Image-Lightning-8steps-V1.1, and ModelSamplingAuraFlow prepares the model.

The image and its mask come from LoadImage. ImageScaleToTotalPixels scales the image to about 1.68 megapixels. The inpainting itself uses ControlNetInpaintingAliMamaApply with Qwen-Image-InstantX-ControlNet-Inpainting, which takes the image, mask and prompt conditioning together. The image is VAE-encoded for the latent, KSampler runs 8 steps with euler and the simple scheduler, and VAEDecode with SaveImage writes the result.

The example prompt adds a gold tiara with gems and a pearl necklace to an elf princess.

## Tips

- Paint the mask a little larger than the object you want to replace, to leave room for blending.
- Describe only what should appear in the masked region.
- Input is scaled to roughly 1.68 megapixels, so very large images are reduced during the edit.
- Change the seed and rerun if the fill does not match the surroundings.
