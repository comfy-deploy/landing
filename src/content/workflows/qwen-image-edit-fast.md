---
title: "Qwen-Image Edit Fast (Lightning)"
seoTitle: "Qwen-Image-Edit Lightning ComfyUI Workflow"
description: "Edit an image with text using Qwen-Image-Edit and the 4-step Lightning LoRA, with a preset task list and optional prompt enhancing. Runs on ComfyDeploy."
summary: "Upload one image and pick a task or write an instruction, and Qwen-Image-Edit changes it in a few steps. Good for background swaps, product shots and character edits."
family: "Qwen-Image"
tasks:
  - image-editing
inputs:
  - "Input image"
  - "Edit instruction"
  - "Task preset"
  - "Enhance prompt toggle"
  - "Seed"
outputs:
  - "Edited image"
useCases:
  - "Replacing product backgrounds for ad shots"
  - "Editing a character outfit, pose or expression"
  - "Adding or removing objects"
  - "Quick edits where speed matters more than maximum quality"
faq:
  - q: "What GPU does the fast Qwen-Image-Edit workflow need?"
    a: "The recommended GPU is an L40S. It uses qwen_image_edit_fp8_e4m3fn with the 4-step Lightning LoRA."
  - q: "What does the prompt enhance toggle do?"
    a: "When prompt_on_off is on, an LLM node (an OpenAI provider in the graph) expands your text using the selected task before it reaches the model. When off, your text is used as written."
  - q: "How do I run Qwen-Image-Edit Fast as an API?"
    a: "Deploy it on ComfyDeploy and call the endpoint with the image, task, prompt and seed. The generated output is returned from the API response."
---

## How it works

The edit itself runs on qwen_image_edit_fp8_e4m3fn.safetensors, loaded through UNETLoader, with qwen_2.5_vl_7b_fp8_scaled.safetensors as the text encoder and qwen_image_vae.safetensors as the VAE. A LoraLoaderModelOnly applies Qwen-Image-Lightning-4steps-V1.0, which is what makes this the fast variant.

Your image is scaled by ImageScaleToTotalPixels, encoded with VAEEncode, and sent with the prompt into TextEncodeQwenImageEdit. ModelSamplingAuraFlow and CFGNorm adjust the model, and KSampler and VAEDecode produce the result.

Prompt handling is the distinctive part. The task enum lists many presets such as Qwen-Image-Edit Auto-Task, character outfit and pose edits, relighting, colorize, remove text and more. SystemPromptTaskGenerator builds the system prompt for the chosen task, and an LLMToolkitTextGeneratorStream node with an OpenAIProviderNode can rewrite your text when enhancing is on. SwitchAny nodes choose between the enhanced and manual prompt.

## Tips

- Turn enhancing off and write a full instruction yourself if you do not have an OpenAI key in machine secrets.
- Use the task preset that matches your goal, then put specifics in the prompt, like the banana juice ad example.
- For quoted text in the image, put the exact words in quotes.
- For two reference images, see the Dual Qwen-Edit workflow instead.
