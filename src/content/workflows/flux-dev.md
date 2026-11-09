---
title: "Flux Dev Text-to-Image"
seoTitle: "Flux Dev ComfyUI Text-to-Image Workflow"
description: "A simple Flux Dev text-to-image workflow for ComfyUI using flux1-dev-fp8. Enter a prompt and size, and run it in the cloud on ComfyDeploy."
summary: "The standard Flux Dev text-to-image graph with prompt, width and height inputs. A clean starting point for Flux prompting or for deploying Flux as an API."
family: "Flux"
tasks:
  - text-to-image
inputs:
  - "Text prompt"
  - "Image width"
  - "Image height"
outputs:
  - "Generated image"
useCases:
  - "General text-to-image generation with Flux"
  - "Illustration and concept art from detailed prompts"
  - "A base graph to extend with LoRAs or upscalers"
  - "Serving Flux Dev behind your own API"
faq:
  - q: "What GPU does this Flux Dev workflow need?"
    a: "It is configured for an A100 on ComfyDeploy and uses the fp8 checkpoint flux1-dev-fp8.safetensors."
  - q: "Does Flux Dev support negative prompts?"
    a: "No. The workflow note says Flux dev has no negative prompt, so CFG stays at 1.0 and the negative input is ignored."
  - q: "How do I run Flux Dev as an API?"
    a: "Deploy the workflow on ComfyDeploy and call it with prompt, width and height. The response is the generated image."
---

## How it works

This is the official Flux Dev example turned into a deployable workflow. A CheckpointLoaderSimple loads `flux1-dev-fp8.safetensors`, which bundles the model, text encoders and VAE in one file.

The prompt arrives through a text input and goes to a CLIPTextEncode node. A FluxGuidance node adds the guidance value that Flux uses in place of classic CFG. A second CLIPTextEncode holds an empty negative prompt that the sampler requires but Flux ignores.

Width and height inputs feed an EmptySD3LatentImage node, which sets the canvas. A KSampler denoises the latent, VAEDecode converts it to pixels and SaveImage stores the result. The graph has 13 nodes and needs no custom node packages.

## Tips

- Leave CFG at 1.0 in the KSampler. Use the FluxGuidance value to control how closely the image follows your prompt.
- Flux responds well to long, descriptive prompts that name the subject, setting, lighting and style.
- Common sizes such as 1024x1024 work well. Keep both sides divisible by 16.
- Change the seed in the KSampler to get new variations of the same prompt.

## Run it as an API

The prompt and size are exposed as inputs, so this graph can be deployed on ComfyDeploy as a Flux endpoint.
