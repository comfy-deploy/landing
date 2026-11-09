---
title: "Wan 2.2 First and Last Frame to Video"
seoTitle: "Wan 2.2 First-Last Frame ComfyUI Workflow"
description: "Give Wan 2.2 a first and a last frame and it animates the in-between. Native ComfyUI image-to-video with Lightning 4-step LoRAs, in the cloud on ComfyDeploy."
summary: "Provide a starting image and an ending image and a prompt, and Wan 2.2 generates the video that connects them. Built from native ComfyUI nodes with 4-step Lightning LoRAs for speed."
family: "Wan"
tasks:
  - image-to-video
inputs:
  - "First frame image"
  - "Last frame image"
  - "Text prompt"
outputs:
  - "Video animating from the first to the last frame"
useCases:
  - "Morphing between two product shots"
  - "Animating a scene change between two stills"
  - "Storyboard to motion previews"
  - "Looping clips by reusing the first frame as the last"
faq:
  - q: "What GPU does this Wan 2.2 first-last-frame workflow need?"
    a: "It is set up for an L40S on ComfyDeploy. It loads the 14B fp8 high-noise and low-noise models."
  - q: "Why does it run fast?"
    a: "Both Wan 2.2 models have a Lightning 4-step LoRA applied, so each sampler stage needs only a few steps."
  - q: "How do I run it as an API?"
    a: "Deploy it on ComfyDeploy and call the endpoint with the two frames and a prompt. The video file is returned."
---

## How it works

Two LoadImage nodes supply the first and last frames, and ResizeAndPadImage nodes fit them to a common size. GetImageSize passes the dimensions on so both frames match the video.

The WanFirstLastFrameToVideo node builds the conditioning from both images, a CLIPTextEncode prompt and a negative prompt. Text is encoded with `umt5_xxl_fp8_e4m3fn_scaled.safetensors` and latents are decoded with `wan_2.1_vae.safetensors`.

Wan 2.2 uses two experts. `wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors` handles the early steps and `wan2.2_i2v_low_noise_14B_fp8_scaled.safetensors` finishes the detail. Each one has its own ModelSamplingSD3 node, a Lightning LoRA (`Wan2.2-Lightning_I2V-A14B-4steps-lora_HIGH_fp16` and `..._LOW_fp16`), and a KSamplerAdvanced stage. CreateVideo and SaveVideo write the result.

## Tips

- Pick two frames that share lighting and subject. The model fills in motion, but large differences produce abrupt morphs.
- Describe the motion between the frames in the prompt, not only what the frames look like.
- The included negative prompt is the standard Chinese Wan negative prompt. Leave it as is unless you see a specific artifact.
- To make a looping clip, use the same image for both frames.

## Run it as an API

You can deploy this workflow on ComfyDeploy as a hosted API endpoint. The inputs listed above become the request fields, so your own app can submit them and receive the finished result without running ComfyUI yourself. The same workflow can also be run and shared from the ComfyDeploy playground in your browser.
