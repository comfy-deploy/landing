---
title: "Date Scene Image and Video (Kontext and Seedance)"
seoTitle: "Flux Kontext + Seedance Date Video ComfyUI Workflow"
description: "Combine a character picture and a photo of you, place both in a scene with Flux Kontext through BFL, then animate with Seedance Pro. Runs on ComfyDeploy."
summary: "Upload an image of a character and one of yourself, name a place such as Tokyo Tower, and get a date image and a short video."
family: "Flux Kontext"
tasks:
  - "image-editing"
  - "image-to-video"
inputs:
  - "Person image"
  - "Character image"
  - "Scene prompt"
  - "Aspect ratios"
  - "Seed"
outputs:
  - "Combined scene image"
  - "Short MP4 video"
useCases:
  - "Fan-art style date scenes"
  - "Fun shareable clips with a favorite character"
  - "Testing multi-image Kontext compositions"
  - "Short animated social posts from two photos"
faq:
  - q: "What GPU does this workflow need?"
    a: "It is listed as CPU, so it runs without a GPU. Kontext runs on the Black Forest Labs API and the video comes from Seedance Pro through WaveSpeed."
  - q: "What goes in the prompt?"
    a: "A short place or scene, such as Romantic date at Tokyo Tower. The input notes also list preset tasks such as Teleport, Relight and Change Outfit, with comma-separated keywords."
  - q: "How do I run this date scene workflow as an API?"
    a: "Deploy the workflow on ComfyDeploy and call the generated endpoint. The ComfyUIDeployExternal input and output nodes in the graph become the request and response fields."
---

## How it works

No local diffusion model is used. The two images are resized with ImageResizeKJv2, background-cleaned with BiRefNetRMBG if needed, and merged with ImageStitch. FluxKontextImageScale sets the size.

The llm-toolkit handles prompting. SystemPromptTaskGenerator and PromptManager produce an image prompt from your scene text, and a second chain writes the video prompt. The image goes to Flux Kontext on the Black Forest Labs API through BFLProviderNode, ConfigGenerateImageBFL and GenerateImage. The result is previewed and saved.

The video step takes that image and sends it to Seedance Pro image-to-video using ConfigGenerateVideoSeedanceProI2V and WaveSpeedProviderNode with GenerateVideo, and PreviewVideo shows the clip. Separate aspect ratio inputs control the input stitch and the output.

## Tips

- Set the output aspect ratio to match the shape you want for the video, such as 9:16 for vertical.
- Keep the scene prompt short and concrete.
- Use clear single-subject photos for both inputs.
- Both API steps need provider keys set up on your machine or account.
