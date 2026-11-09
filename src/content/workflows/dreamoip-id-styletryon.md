---
title: "DreamO ID, IP, Style and Try-On (Flux)"
seoTitle: "DreamO ComfyUI Workflow: ID, Style and Try-On"
description: "Use DreamO on Flux to carry identity, objects, clothing or style from two reference images into a new image, with optional LLM prompts. Runs on ComfyDeploy."
summary: "Give it up to two reference images, pick a task for each (id, ip or style), and describe the scene. Set up for virtual try-on and identity-preserving portraits."
family: "Flux"
tasks:
  - "image-editing"
  - "text-to-image"
inputs:
  - "Reference image 1"
  - "Reference image 2"
  - "Task per reference (id, ip, style)"
  - "Scene prompt"
  - "LLM model name"
  - "Seed"
outputs:
  - "Generated image"
useCases:
  - "Virtual try-on with a person photo and a garment photo"
  - "Putting a person into a new scene while keeping their face"
  - "Applying a painting or illustration style to a subject"
  - "Placing a product or accessory on a model"
faq:
  - q: "What GPU does the DreamO try-on workflow need?"
    a: "The recommended GPU is the A10G. ComfyDeploy provisions it for you, so there is nothing to install."
  - q: "What do the id, ip and style options do?"
    a: "Each reference image is assigned one task. The Enum inputs offer id (a person or face), ip (an object or garment) and style (an art style). The default is id for image one and ip for image two."
  - q: "Do I need an OpenAI key?"
    a: "The prompt generator uses an OpenAI-compatible LLM node, set to gpt-4.1-mini by default. You can write the prompt by hand in the ACTION_MANUAL_PROMPT input instead."
---

## How it works

The base model is flux1-dev-fp8 with clip_l, t5xxl_fp8_e4m3fn and ae.safetensors. The DreamO custom node package adds a DreamOProcessorLoader, two DreamORefEncode nodes (one per reference image) and ApplyDreamO, which injects the reference features into the model before sampling.

Each reference image is resized with ImageResizeKJv2, and BiRefNetRMBG can remove its background so only the subject is used. Each image is paired with a task: id, ip or style. KSampler runs the generation, and a Power Lora Loader (rgthree) is available for extra LoRAs.

Prompting is handled by an LLM Toolkit chain. A long system prompt (DreamO-Prompt-Generator) takes captions of the reference images, the mode (id, ip, style or try-on) and your one-line hint, and returns a prompt plus a suggested guidance value. StringReplace and JoinStringMulti nodes assemble the final text.

## Tips

- Use a clear front-facing photo for the id reference and a flat, uncluttered product photo for the ip reference.
- If the face looks glossy, the generator prompt itself suggests lowering guidance from 3.5 to about 2.8.
- Use a single reference by setting a task for image one only.
- Start with a simple scene hint; the LLM expands it into a full prompt.

## Run it as an API

Seed, tasks, prompts and the two image slots are ComfyDeploy inputs, so you can wire the workflow into a try-on feature through the API.
