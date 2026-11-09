---
title: "Flux Fill Inpainting (Native)"
seoTitle: "Flux Fill Inpainting ComfyUI Workflow"
description: "Edit part of an image by painting a mask and typing a prompt with flux1-fill-dev. A basic native ComfyUI inpainting workflow that runs on ComfyDeploy."
summary: "Paint a mask over the area you want to change, describe what should go there, and Flux Fill fills it in. A simple starting point for inpainting with Flux."
family: "Flux"
tasks: ["inpaint-outpaint", "image-editing"]
inputs: ["Image with a painted mask", "Text prompt"]
outputs: ["Inpainted image"]
useCases: ["Add accessories or clothing to a portrait", "Remove or replace an object", "Fix a small area of a generated image", "Local edits without changing the rest of the picture"]
faq: [{"q": "What GPU does this Flux Fill workflow need?", "a": "It is set to run on an L40S GPU on ComfyDeploy."}, {"q": "How do I make the mask?", "a": "Right-click the Load Image node and open the mask editor, paint over the area to change, save, then write a prompt describing the new content."}, {"q": "How do I run it as an API?", "a": "Deploy it on ComfyDeploy and call the endpoint with an image and prompt. The workflow has a ComfyDeploy node, so check which inputs you expose before deploying."}]
---

## How it works

This is a compact 18-node workflow that uses only core ComfyUI nodes and no custom packages. `UNETLoader` loads `flux1-fill-dev.safetensors`, `DualCLIPLoader` loads `clip_l` and `t5xxl_fp16`, and `VAELoader` loads `ae.safetensors`.

The image is loaded with `LoadImage`, which also carries the mask you paint, and scaled with `ImageScaleToMaxDimension`. `InpaintModelConditioning` combines the positive and negative prompt conditioning with the image, VAE and mask. `FluxGuidance` sets the guidance value, and `DifferentialDiffusion` makes the model blend the edited area softly into the surroundings.

`KSampler` runs the denoising, `VAEDecode` converts the result back to pixels, and `SaveImage` writes the output. A `MaskToImage` and `ImageToMask` pair is used to prepare the mask.

## Tips

- Write the prompt about the new content only, as in the example that adds rabbit ears and a red scarf.
- Mask slightly beyond the object you want to replace so the edge blends cleanly.
- Make several smaller edits one after another rather than one very large mask.
- Reduce the maximum dimension if you want faster runs while testing.
- Because this graph uses only core nodes, it is easy to extend later, for example by adding a LoRA loader after the model or a second pass for polish.
