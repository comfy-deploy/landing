---
title: "Wan 2.2 First-Last-Frame Video (Fast)"
seoTitle: "Wan 2.2 First Last Frame ComfyUI Workflow"
description: "Create a video by giving Wan 2.2 a start image, an end image and a text prompt, using GGUF Q8 and light LoRAs for speed. Runs on ComfyDeploy."
summary: "Upload a first and last frame, describe the motion, and Wan 2.2 animates the transition between them. Made for creators who need controlled start and end points."
family: "Wan"
tasks:
  - image-to-video
inputs:
  - "Start image"
  - "End image"
  - "Positive prompt"
  - "Negative prompt"
  - "Length (frames)"
  - "Quality (HQ, MQ, LQ)"
  - "Aspect ratio"
  - "Seed"
outputs:
  - "Interpolated MP4 video"
useCases:
  - "Animating between two keyframes or storyboard frames"
  - "Looping or morphing between two states"
  - "Scene transitions with a prompt-defined action"
  - "Controlled shots for comics and animation"
faq:
  - q: "What GPU does the Wan 2.2 first-last-frame workflow need?"
    a: "The recommended GPU is an L40S. It loads the Wan2.2 I2V A14B high-noise and low-noise Q8 GGUF models."
  - q: "How do I make it faster?"
    a: "Use the quality input: HQ, MQ or LQ. The workflow also uses light I2V LoRAs for the high- and low-noise models and a reduced default length of 49 frames."
  - q: "How do I run the Wan 2.2 first-last-frame workflow as an API?"
    a: "Deploy it on ComfyDeploy and call the endpoint with the two images, prompt, length and quality. The generated output is returned from the API response."
---

## How it works

The workflow uses the ComfyUI-WanVideoWrapper nodes. Two WanVideoModelLoader nodes load Wan2.2-I2V-A14B-HighNoise-Q8_0.gguf and Wan2.2-I2V-A14B-LowNoise-Q8_0.gguf, and two WanVideoLoraSelect nodes add the matching ligh-i2v high-noise and low-noise LoRAs. Text encoding uses umt5_xxl_fp8_e4m3fn_scaled.safetensors and the VAE is wan_2.1_vae.safetensors.

Your start and end images are resized with ImageResize+ and encoded together by WanVideoImageToVideoEncode, so the first and last frames of the clip are anchored. Two WanVideoSampler passes run the high-noise stage and then the low-noise stage, WanVideoBlockSwap helps with memory, and WanVideoDecode turns the latents into frames.

Afterward, the frames go through RIFE VFI (rife47.pth) for frame interpolation, then FastLaplacianSharpen and FastFilmGrain, and CreateVideo and SaveVideo write the file. The quality enum (HQ, MQ, LQ) picks the resolution preset and a mode input offers I2V720p, I2V480p and other options.

## Tips

- Pick end images that are plausible continuations of the start image. Big jumps lead to morphing.
- Describe the motion in the prompt, not just the scene, as the example does with subject, motion and camera sections.
- Use LQ or MQ to test an idea, then rerun at HQ.
- Keep the length at 49 frames or lower for quicker tests.
