---
title: "Video Control Map Creator (Depth, Pose, Lines)"
seoTitle: "Video ControlNet Map Creator ComfyUI Workflow"
description: "Turn a video into depth or other control map videos with Depth Anything V2 and the AIO Preprocessor for ControlNet video work. Runs on ComfyDeploy."
summary: "Upload a video and the workflow saves a depth map video plus a second control map such as line art, pose or canny. A utility for preparing guidance clips."
family: "Other"
tasks:
  - video-editing
  - controlnet
inputs:
  - "Input video"
  - "Extra map type"
  - "Resolution preset"
  - "Aspect ratio"
  - "Frame count"
  - "Forced FPS"
outputs:
  - "Depth map video"
  - "Second control map video"
useCases:
  - "Preparing depth videos for video ControlNet or VACE-style workflows"
  - "Extracting line art, pose or canny maps from clips"
  - "Batch converting clips to guidance videos"
  - "Checking how a preprocessor sees your footage"
faq:
  - q: "What GPU does the video control map workflow need?"
    a: "The recommended GPU is an A10G. It runs the Depth Anything V2 vitg fp32 model on every frame, plus one more preprocessor."
  - q: "Which control maps can I create?"
    a: "Depth is always made with Depth Anything V2. The EXTRA_MAP_TYPE dropdown picks an additional AIO Preprocessor map, with options such as AnyLineArt, Canny, DensePose and Depth Anything, or none."
  - q: "How do I run the video control map creator as an API?"
    a: "Deploy it on ComfyDeploy and call the endpoint with the input video and options. The result is returned from the API response."
---

## How it works

This is a utility, not a generator. It reads a video, makes control maps for each frame, and writes them out as new videos.

VHS_LoadVideo from comfyui-videohelpersuite loads the input video with the frame count and forced FPS you set (defaults are 81 frames and 15 fps). ImageResizeKJv2 resizes the frames to a size chosen by VideoResolutionSelector from the aspect ratio (Horizontal, Vertical or Squarish), the quality tier (HQ, MQ, LQ) and a VideoModel setting with options like I2V480p, I2V720p, T2V1.3B and T2V14B. These names are resolution presets for Wan-style video models.

DownloadAndLoadDepthAnythingV2Model and DepthAnything_V2 produce the depth video using depth_anything_v2_vitg_fp32.safetensors. A second pass uses AIO_Preprocessor from comfyui_controlnet_aux with the map type in EXTRA_MAP_TYPE. Two VHS_VideoCombine nodes save the two results as videos.

## Tips

- Match the resolution preset to the model you plan to use the maps with.
- Lower the frame count to test a preprocessor choice before running a full clip.
- Set EXTRA_MAP_TYPE to none if you only need depth.
- Use the same FPS for the control video and the generation workflow so the frames line up.
