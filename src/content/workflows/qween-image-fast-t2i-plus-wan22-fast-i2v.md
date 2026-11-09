---
title: "Qwen-Image to Wan 2.2 Fast Video"
seoTitle: "Qwen-Image + Wan 2.2 Text-to-Video ComfyUI Workflow"
description: "Generate a still with a distilled Qwen-Image GGUF, then animate it with Wan 2.2 I2V GGUF and RIFE interpolation, all in one workflow on ComfyDeploy."
summary: "Write an image prompt and a video prompt. A fast Qwen-Image Distill model makes the first frame and Wan 2.2 turns it into a short, smoothed video."
family: "Wan"
tasks:
  - "text-to-video"
  - "image-to-video"
inputs:
  - "Image prompt"
  - "Video prompt"
  - "Video negative prompt"
  - "Number of frames"
  - "Seed"
  - "Resolution"
outputs:
  - "Generated still image"
  - "MP4 video"
useCases:
  - "Short cinematic clips from text only"
  - "Product or vehicle b-roll with a controlled first frame"
  - "Fast concept animatics"
  - "Testing video ideas with a quick GGUF stack"
faq:
  - q: "What GPU does the Qwen-Image plus Wan 2.2 workflow need?"
    a: "The recommended GPU is the L40S. ComfyDeploy provisions it for you, so there is nothing to install."
  - q: "Why does it start with an image?"
    a: "It is a two-model route to text-to-video. Qwen-Image makes the first frame, then Wan 2.2 image-to-video animates it. That keeps the look under control from the first frame."
  - q: "How many frames does it make?"
    a: "The default num_frames input is 49. You can change it, and a RIFE VFI node interpolates frames for smoother motion."
---

## How it works

Stage one makes the still. UnetLoaderGGUF loads Qwen_Image_Distill-Q8_0.gguf, CLIPLoader loads qwen_2.5_vl_7b_fp8_scaled, and qwen_image_vae decodes. ModelSamplingAuraFlow and KSampler sample, and the result is saved as an image. ResolutionSelector picks the size.

Stage two animates it with the ComfyUI-WanVideoWrapper nodes. Two GGUF models, Wan2.2-I2V-A14B-HighNoise-Q8_0 and Wan2.2-I2V-A14B-LowNoise-Q8_0, are loaded by WanVideoModelLoader, each with a matching lightning LoRA (ligh-i2v_high_noise_model and ligh-i2v_low_noise_model) chosen in WanVideoLoraSelect. The text encoder is umt5_xxl_fp8_e4m3fn_scaled and the VAE is wan_2.1_vae. Two WanVideoSampler nodes run the high-noise and low-noise passes, and block swap keeps memory use down.

Finishing steps are RIFE VFI with rife47.pth for interpolation, FastLaplacianSharpen and FastFilmGrain, then CreateVideo and SaveVideo. The easy-use nodes clean GPU memory between stages.

## Tips

- Write the video prompt as Subject, Scene, Motion and Aesthetic, like the default example.
- Keep num_frames modest for fast runs, because both frame count and resolution add time.
- Edit the video negative prompt only if you see a specific artifact.
- Describe the first frame clearly in the image prompt, since the video starts from it.
