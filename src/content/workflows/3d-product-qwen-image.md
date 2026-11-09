---
title: "3D Product Shots with Qwen-Image"
seoTitle: "Qwen-Image 3D Product Render ComfyUI Workflow"
description: "Turn a 3D model or product image into an ad-style render with Qwen-Image and Canny control, using a task preset and optional LLM prompt help on ComfyDeploy."
summary: "Feed in a 3D model or product photo, optionally with a style reference, and get a product ad or pseudo-3D render that keeps the original shape and camera angle."
family: "Qwen-Image"
tasks:
  - "text-to-image"
  - "controlnet"
  - "image-editing"
inputs:
  - "3D model or reference image"
  - "Second reference image (materials and colors)"
  - "Text prompt"
  - "Task preset"
  - "Aspect ratio"
outputs:
  - "Product ad image"
  - "Pseudo-3D render of a model"
useCases:
  - "Product ads from a bare 3D model"
  - "Re-texturing a product with the materials of a second reference"
  - "Pseudo-3D renders of game or CAD assets"
  - "Packshot variations for e-commerce listings"
faq:
  - q: "What GPU does the Qwen-Image 3D product workflow need?"
    a: "The recommended GPU is the L40S. ComfyDeploy provisions it for you, so there is nothing to install."
  - q: "Can I use my own LoRA?"
    a: "Yes. The graph uses two LoraLoaderModelOnly nodes (Qwen-Image-Lightning 8-step and flymy_realism). Swap those files for your own LoRAs on your ComfyDeploy machine."
  - q: "How do I run the Qwen-Image 3D product workflow as an API?"
    a: "Deploy the workflow on ComfyDeploy and call the generated endpoint. The ComfyUIDeployExternal input and output nodes in the graph become the request and response fields."
---

## How it works

The workflow loads qwen_image_fp8_e4m3fn with the qwen_2.5_vl_7b_fp8_scaled text encoder and qwen_image_vae. A Load3D node (or a plain image input) provides the source. An AIO_Preprocessor extracts Canny edges, and QwenImageDiffsynthControlnet applies qwen_image_canny_diffsynth_controlnet at a strength of 0.66 so the output keeps the shape and camera angle of the original.

Two LoRAs are stacked on the model: Qwen-Image-Lightning-8steps-V1.1 for fast sampling and flymy_realism for a more photographic look. KSampler then denoises in 8 steps with the euler sampler. An ALT_LATENT switch chooses between an empty latent and the encoded input image as the starting point.

Prompts can be written by hand or enhanced. When prompt enhancement is on, an LLM Toolkit chain (PromptManager, SystemPromptTaskGenerator, OpenAIProviderNode) turns your short text into a full prompt based on the chosen task. The task list is long and includes Qwen-Image, Qwen-Image-Edit auto-task, Kontext auto-task, Product, Relight and others, so the same graph covers more than product shots.

## Tips

- Turn prompt enhancement off and write the prompt yourself if you do not have an OpenAI key set as a machine secret.
- To restyle materials, add a second image and say so in the prompt, for example keeping the shape of image one while matching the materials of image two.
- Use the negative prompt field for anything that keeps showing up in the render.
- Use a clean, well-lit render of the 3D model; the Canny edges drive the structure.

## Run it as an API

The seed, task, prompt, aspect ratio and image inputs are exposed as ComfyDeploy inputs, so you can call the workflow as an API from a storefront or asset pipeline.
