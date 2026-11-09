---
title: "Image to Flux LoRA (Experimental)"
seoTitle: "Flux Image to LoRA ComfyUI Workflow"
description: "Experimental ComfyUI workflow that trains a Flux LoRA from a single image, then tests it with Kontext-based sample prompts. Version 1, runs on ComfyDeploy."
summary: "An early experiment in training a Flux LoRA from one image with comfyui-fluxtrainer. The author labels this version 1 and says it is not working yet."
family: "Flux"
tasks:
  - image-editing
  - text-to-image
inputs:
  - "Single source image"
  - "Caption or style prompts"
outputs:
  - "Sample images"
  - "Trained LoRA"
useCases:
  - "Experimenting with one-image LoRA training"
  - "Studying the Flux trainer node chain"
  - "Generating style-consistent sample images"
  - "A base to fork for your own LoRA training graph"
faq:
  - q: "What GPU does img2lora need?"
    a: "The recommended GPU is an L40S. It loads flux1-dev, the Kontext fp8 model and t5xxl, and it includes Flux trainer nodes."
  - q: "Does it work?"
    a: "The author describes it as v1 and not working. Treat it as a reference graph to learn from or modify, not as a finished tool."
  - q: "Which models does it reference?"
    a: "flux1-dev.safetensors, flux1-dev-kontext_fp8_scaled.safetensors, clip_l, t5xxl in fp16 and fp8 variants, ae.safetensors, and two example rank-16 LoRA files."
---

## How it works

This 463-node graph is an experiment, and its description says it is version 1 and not working. The summary below reflects the nodes in it, and its behavior is not guaranteed.

The goal is to train a Flux LoRA from one image automatically. The graph uses comfyui-fluxtrainer for training, along with comfyui-kjnodes, rgthree-comfy, WAS node suite, essentials and others. FL_GeminiVideoCaptioner nodes from comfyui_fill-nodes produce captions, and Text Load Line From File nodes read prompt lines. Roughly 20 parallel branches each repeat the same chain: a FluxKontextImageScale step, VAEEncode, ReferenceLatent, FluxGuidance, KSampler and VAEDecode, saved with SaveImageKJ. This looks like a batch of varied views of the source image built with Flux Kontext dev (flux1-dev-kontext_fp8_scaled), which would give a small training set.

Models referenced are flux1-dev.safetensors, the Kontext fp8 file, clip_l, t5xxl, ae.safetensors, and sample LoRAs. The example prompt asks for a swan portrait in the same elegant style.

## Tips

- Treat this as a graph to study or fork, since it is marked as not working.
- Check the Note nodes in the editor for the author's instructions.
- Expect long runs given the number of parallel branches.
- Replace the hardcoded LoRA paths with your own files before editing.
