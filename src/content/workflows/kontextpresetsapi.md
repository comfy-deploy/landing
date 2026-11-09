---
title: "Kontext Presets via BFL API"
seoTitle: "Flux Kontext Presets ComfyUI Workflow (API)"
description: "Run Flux Kontext presets such as Relight, Teleport, Cartoonify and Haircut through the Black Forest Labs API with LLM prompts. No GPU needed on ComfyDeploy."
summary: "Pick a preset task, add a few keywords, and send one or two images to Flux Kontext through the Black Forest Labs API. An LLM turns your keywords into the edit prompt."
family: "Flux Kontext"
tasks:
  - "image-editing"
inputs:
  - "Input image"
  - "Optional second image"
  - "Preset task"
  - "Keywords"
  - "Input and output aspect ratio"
  - "Seed"
outputs:
  - "Edited image"
useCases:
  - "Relighting a portrait with golden hour or neon looks"
  - "Teleporting a subject into a new location"
  - "Cartoon, anime or movie poster versions of a photo"
  - "Interior design and furniture removal on room photos"
faq:
  - q: "What GPU does the Kontext presets workflow need?"
    a: "It is listed as CPU, so it runs without a GPU. The editing is done by Flux Kontext on the Black Forest Labs API, using the BFLProviderNode."
  - q: "Which presets are included?"
    a: "The input notes list tasks such as Teleport, Move Camera, Relight, Product, Zoom, Colorize, Movie Poster, Cartoonify, Remove Text, Haircut, Bodybuilder, Remove Furniture, Interior Design, Season Shift, Age Progression, Add Pet, Historical Era, Dramatic Weather, Mirror World, Virtual Makeup, Pattern Overlay, Change Outfit and Double Exposure."
  - q: "How do I run the Kontext presets workflow as an API?"
    a: "Deploy the workflow on ComfyDeploy and call the generated endpoint. The ComfyUIDeployExternal input and output nodes in the graph become the request and response fields."
---

## How it works

This graph has no local diffusion model. Images are loaded, resized with ImageResizeKJv2 and ResolutionSelector, and optionally stitched together with ImageStitch. BiRefNetRMBG is available for background removal, and FluxKontextImageScale prepares sizes.

Prompt writing is done by the llm-toolkit. A SystemPromptTaskGenerator holds a preset for each task, and PromptManager with LLMToolkitTextGeneratorStream expands your comma-separated keywords into a full instruction. A LocalTransformersProviderNode is included as a provider option. The finished prompt goes to ConfigGenerateImageBFL and GenerateImage through BFLProviderNode, which calls Flux Kontext on the Black Forest Labs API, and SaveImage stores the output.

The notes explain how to fill the keyword field. Some tasks, such as Remove Text and Remove Furniture, need nothing special, but the field cannot be empty, so enter a neutral word like subject. Four-variation tasks accept one to four comma-separated descriptors, for example dog, cat, bird for Add Pet.

## Tips

- Match the input and output aspect ratio settings when you can.
- Use short descriptors, for example golden hour or neon noir, rather than full sentences.
- The Black Forest Labs step needs an API key.
- Use the four-variation tasks to explore options in one run.
