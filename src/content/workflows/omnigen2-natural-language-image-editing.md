---
title: "OmniGen2 Natural Language Image Editing"
seoTitle: "OmniGen2 Image Editing ComfyUI Workflow"
description: "Edit and combine images with plain-language prompts using OmniGen2 in ComfyUI, with two concept inputs. Runs in the cloud on ComfyDeploy."
summary: "Give OmniGen2 one or two concept images and a written instruction to generate or edit an image. It is an experimental multimodal model that is useful for combining characters and concepts."
family: "OmniGen2"
tasks: ["image-editing", "text-to-image"]
inputs: ["Concept image 1", "Concept image 2", "Text prompt", "Negative prompt", "Aspect ratio", "Steps", "Number of images", "Seed", "Widen difference"]
outputs: ["Generated or edited image"]
useCases: ["Combine two characters into one scene", "Wedding or portrait figures from two source photos", "Edit an image with a text instruction", "Experiment with a multimodal model"]
faq: [{"q": "What GPU does this OmniGen2 workflow need?", "a": "It is set to run on an L40S GPU on ComfyDeploy. It loads omnigen2_fp16 and qwen_2.5_vl_fp16."}, {"q": "How good is OmniGen2?", "a": "The author describes it as an experimental multimodal model without major pretensions that can still produce interesting results in some cases."}, {"q": "How do I run it as an API?", "a": "Deploy it on ComfyDeploy and send the images and prompt to the endpoint. The external input nodes become the API fields."}]
---

## How it works

The workflow loads `omnigen2_fp16.safetensors` with `UNETLoader`, the `qwen_2.5_vl_fp16` text encoder with `CLIPLoader`, and `ae.safetensors` as the VAE.

Two images, Concept1 and concept2, are resized with `ImageScaleToTotalPixels`. Backgrounds can be removed with `BiRefNetRMBG`, and `VAEEncode` converts them to latents. Several `ReferenceLatent` nodes attach those latents to the positive and negative conditioning so the model can see both concepts.

Sampling uses `SamplerCustomAdvanced` with `DualCFGGuider`, `BasicScheduler` and `RandomNoise`. The widen_difference slider controls the guidance difference between the two guiders. Steps default to 50. A `ttN hiresfixScale` node and the `4x_NMKD-Siax_200k` upscaler are included for a second pass. An optional `RepeatLatentBatch` makes several images per run, and image comparers show before and after.

The notes record a tested sampler setting of dpm_adaptive with kl_optimal over 18 steps at about 1.9 CFG.

## Tips

- Reference the images by order in your prompt, such as the girl in the first image and the man in the second.
- Use the negative prompt to reduce deformed faces and blur.
- Lower the steps from 50 for faster drafts.
- Set the number of images above 1 to compare variations.
