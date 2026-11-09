---
title: "SeedVR2 Video Restoration and Upscale"
seoTitle: "SeedVR2 Video Upscale ComfyUI Workflow"
description: "Restore and upscale low-quality video to HD with SeedVR2 and optional RIFE frame interpolation in ComfyUI. Upload a clip, run on ComfyDeploy."
summary: "Upload a low-quality video and SeedVR2 restores and upscales it, then RIFE can interpolate frames for smoother motion. For old clips, AI video and compressed footage."
family: "Other"
tasks:
  - restoration
  - video-editing
inputs:
  - "Input video"
  - "Target aspect ratio"
  - "Output FPS"
  - "Frame interpolation multiplier"
  - "Seed"
outputs:
  - "Restored and upscaled video"
useCases:
  - "Sharpening old or compressed footage"
  - "Upscaling AI-generated video clips"
  - "Smoothing motion with frame interpolation"
  - "Cleaning phone video before editing"
faq:
  - q: "What GPU does SeedVR2 video restoration need?"
    a: "It is configured for an L40S on ComfyDeploy. It uses the 7B fp8 model with a block swap node to limit VRAM."
  - q: "Does it add frames?"
    a: "Yes, optionally. A multiplier input drives a RIFE interpolation node with rife47.pth. A multiplier of 1 leaves the frame count unchanged."
  - q: "How do I run it as an API?"
    a: "Deploy it on ComfyDeploy and send a video plus settings to the endpoint. The restored video file is returned."
---

## How it works

VHS_LoadVideo reads the uploaded clip, and VHS_VideoInfo supplies its size and frame rate. A ResolutionSelector, easy imageSizeByLongerSide and easy mathInt nodes work out the target size from the aspect ratio you choose.

The SeedVR2 node runs `seedvr2_ema_7b_fp8_e4m3fn.safetensors` to restore detail and upscale the frames. SeedVR2BlockSwap moves model blocks in and out of memory so it fits on one GPU, and easy cleanGpuUsed frees memory between stages.

Next, the RIFE VFI node with `rife47.pth` interpolates extra frames based on the multiplier input. CreateVideo assembles the frames at the FPS you set, and SaveVideo writes the file.

## Tips

- Keep clips short at first. Video restoration at HD sizes is memory heavy and time grows with frame count.
- Leave the interpolation multiplier at 1 if the source frame rate is already fine. Use 2 for smoother motion.
- Set the output FPS to match the final frame rate after interpolation.
- Change the seed to get a different restoration if one result has odd texture.

## Run it as an API

You can deploy this workflow on ComfyDeploy as a hosted API endpoint. The inputs listed above become the request fields, so your own app can submit them and receive the finished result without running ComfyUI yourself. The same workflow can also be run and shared from the ComfyDeploy playground in your browser.
