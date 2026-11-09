---
title: "Kontext Two-Image Editing with LLM Prompts"
seoTitle: "Flux Kontext Two-Image Edit ComfyUI Workflow"
description: "Edit a subject image using a second reference image with Flux Kontext Dev. An LLM writes the edit prompt for backgrounds and styles. Runs on ComfyDeploy."
summary: "Upload a subject image and a reference image. An LLM turns your short request into a 70-word Kontext prompt for background swaps, style transfer or object edits."
family: "Flux Kontext"
tasks:
  - "image-editing"
inputs:
  - "Subject image"
  - "Reference image"
  - "Edit request"
  - "LLM model name"
  - "Aspect ratio"
  - "Seed"
outputs:
  - "Edited image"
useCases:
  - "Replacing a background with one from a reference photo"
  - "Applying the style of a painting to a photo"
  - "Small object edits without writing a long prompt"
  - "Text replacement inside an image"
faq:
  - q: "What GPU does the two-image Kontext workflow need?"
    a: "The recommended GPU is the L40S. ComfyDeploy provisions it for you, so there is nothing to install."
  - q: "Do I need an OpenAI key?"
    a: "The prompt step uses an OpenAI-compatible node with gpt-4.1 set as the default. Without a key, remove the system prompt step and write the full prompt yourself."
  - q: "How are the two images used?"
    a: "Image 1 is the subject to edit. Image 2 supplies background, style, texture or palette depending on the task. The system prompt describes rules for background, style, object and text edits."
---

## How it works

The base model is flux1-kontext-dev, loaded with clip_l, t5xxl_fp8_e4m3fn and ae.sft. Both images pass through ImageResizeKJv2 and can be background-cleaned with BiRefNetRMBG. AILab_ImageStitch combines them into one input so Kontext sees both pictures. FluxKontextImageScale resizes the result to a size Kontext handles well, and VAEEncode with ReferenceLatent feeds it to the model.

The distinctive part is the prompt writer. LLMToolkitTextGeneratorStream with PromptManager and an OpenAIProviderNode runs a long system prompt called Kontext. It tells the LLM to produce a single paragraph of exactly 70 words, name the subject, say what stays unchanged, and pick a template for background replacement, style transfer, object edits or text edits.

Sampling uses SamplerCustomAdvanced with FluxDisableGuidance. VAEDecode outputs the image, and an Image Comparer node lets you check before and after.

## Tips

- Name the task clearly in your short request, such as change the background or apply the style, so the LLM picks the right template.
- Match the aspect ratio setting to your subject image to avoid unwanted cropping.
- Read the generated prompt in the display node and adjust it if it drifts.
- Use a reference image with an obvious background or style, since the LLM describes it from the image.
