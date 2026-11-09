---
title: "Flux Canny ControlNet (Krea Dev)"
seoTitle: "Flux Canny ControlNet ComfyUI Workflow"
description: "Guide Flux Krea Dev with a Canny edge map through the Flux ControlNet Union Pro 2.0 to keep a composition and restyle it from text. Runs on ComfyDeploy."
summary: "Load a Canny edge image, describe the scene, and generate a new image that follows the same outlines in the style your prompt describes."
family: "Flux"
tasks:
  - "controlnet"
  - "image-editing"
inputs:
  - "Canny edge image"
  - "Text prompt"
outputs:
  - "Generated image"
  - "Control image preview"
useCases:
  - "Restyling a layout as anime or illustration while keeping outlines"
  - "Rebuilding a scene from a sketch or line art"
  - "Keeping architecture or product outlines fixed"
  - "Making consistent variations of one composition"
faq:
  - q: "What GPU does the Flux Canny ControlNet workflow need?"
    a: "The recommended GPU is the L40S. ComfyDeploy provisions it for you, so there is nothing to install."
  - q: "Which ControlNet does it use?"
    a: "It loads FLUX.1-dev ControlNet Union Pro 2.0 (fp8) and sets the union type to canny. The same node also lists lineart, anime_lineart and mlsd modes."
  - q: "How do I run the Flux Canny ControlNet workflow as an API?"
    a: "Deploy the workflow on ComfyDeploy and call the generated endpoint. The ComfyUIDeployExternal input and output nodes in the graph become the request and response fields."
---

## How it works

This is a native ComfyUI graph with no custom node packages. It loads flux1-krea-dev through UNETLoader, the clip_l and t5xxl_fp16 text encoders through DualCLIPLoader, and ae.safetensors as the VAE.

The image you load is the control image. It is scaled with ImageScaleToMaxDimension to a 1024 pixel maximum and shown in a PreviewImage node so you can see what the ControlNet receives. There is no edge detector in the graph, so supply an image that already contains Canny edges. The ControlNet is loaded with ControlNetLoader from the Union Pro 2.0 fp8 file, and SetUnionControlNetType selects the canny mode. ControlNetApplyAdvanced applies it to both the positive and negative conditioning with a strength of 0.85, ending at the full step range.

Two CLIPTextEncode nodes supply the prompts. FluxGuidance is set to 1.8 on the positive side, and FluxDisableGuidance handles the negative. KSampler runs 26 steps with the heunpp2 sampler and the simple scheduler, then VAEDecode and SaveImage finish the job.

The example prompt describes an evening ramen shop in Tokyo in the style of Makoto Shinkai.

## Tips

- Describe style, lighting and materials in the prompt; the edges already carry the layout.
- Generate the edge map with a Canny node first if you only have a normal photo.
- Lower the ControlNet strength from 0.85 for looser results.
- The union node also supports lineart, anime lineart and mlsd, so you can feed other control images by changing the type.
