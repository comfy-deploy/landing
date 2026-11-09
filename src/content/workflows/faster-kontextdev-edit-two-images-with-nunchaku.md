---
title: "Faster Kontext Dev Two-Image Edit (Nunchaku)"
seoTitle: "Flux Kontext Two Images Nunchaku ComfyUI Workflow"
description: "Combine or edit two images with Flux Kontext Dev using the fast Nunchaku int4 model and turbo LoRA. Runs in the cloud on ComfyDeploy with an L40S GPU."
summary: "Give the workflow two images and a short instruction, and it merges them or applies one to the other using Flux Kontext Dev. It uses the quantized Nunchaku model for faster generation."
family: "Flux Kontext"
tasks: ["image-editing"]
inputs: ["First image", "Second image", "Text prompt", "Aspect ratio", "Remove background toggle", "Enhance prompt toggle", "Batch size", "Seed"]
outputs: ["Edited or combined image (one or more per batch)"]
useCases: ["Merge two characters into one new design", "Place a subject from one image into another scene", "Fast concept iteration with batches of four", "Character design mashups"]
faq: [{"q": "What GPU does this workflow need?", "a": "It is set to run on an L40S GPU. The Nunchaku int4 model (svdq-int4_r32-flux.1-kontext-dev) is smaller and faster than the full-precision Kontext Dev."}, {"q": "What makes it faster than a normal Kontext workflow?", "a": "It loads the model through NunchakuFluxDiTLoader and adds the FLUX.1-turbo-Alpha LoRA, so each image needs fewer steps."}, {"q": "How do I run it as an API?", "a": "Deploy it on ComfyDeploy and call the endpoint with two images, a prompt and options. The batch size input lets you request several results per call."}]
---

## How it works

Two uploaded images each pass through optional background removal (`BiRefNetRMBG` with a color input), then `ImageResizeKJv2` and `FluxKontextImageScale` resize them to sizes Kontext handles well. `ImageStitch` places them side by side, and each is encoded with `VAEEncode` and attached as a `ReferenceLatent`.

The model is `svdq-int4_r32-flux.1-kontext-dev` loaded by `NunchakuFluxDiTLoader`, with `FLUX.1-turbo-Alpha` as a LoRA. Text encoding uses `t5xxl_fp16` and `clip_l` through `DualCLIPLoader`, and `FluxGuidance` sets guidance. Sampling settings noted in the workflow are dpm_adaptive with kl_optimal at 18 steps and a CFG of 1.9.

Prompting can be automatic: with enhance prompt on, a `SystemPromptTaskGenerator` and an OpenAI provider node turn your task into a Kontext-style prompt. With it off, you write the prompt yourself following the Black Forest Labs Kontext guide linked in the notes.

## Tips

- Leave remove_background on when merging characters so textures stay inside the character shape.
- Batch size defaults to 4, which is useful for picking the best of several tries.
- Without an OpenAI key set as a secret, turn enhance prompt off and write the instruction manually.
- Describe what to keep as well as what to change, for example which design elements come from each image.
