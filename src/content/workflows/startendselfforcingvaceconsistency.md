---
title: "Wan Start-End Frame Video with VACE"
seoTitle: "Wan Start and End Frame Video ComfyUI Workflow (VACE)"
description: "Generate video between a start and an end frame with Wan 2.1 VACE and a Self-Forcing 1.3B model, with depth or other control options. Runs on ComfyDeploy."
summary: "Provide a first frame, a last frame and a prompt, and Wan creates the clip between them. VACE control options and the self-forcing model add consistency."
family: "Wan"
tasks:
  - "image-to-video"
  - "video-editing"
inputs:
  - "Start frame"
  - "End frame"
  - "Optional control video"
  - "Action prompt"
  - "Frames and FPS"
  - "Aspect ratio"
  - "Seed"
outputs:
  - "MP4 video"
useCases:
  - "Morphing between two keyframes"
  - "Camera moves between a start and end composition"
  - "Product or mech reveals from two stills"
  - "Controlled shots using depth or pose from a reference clip"
faq:
  - q: "What GPU does the start-end frame VACE workflow need?"
    a: "The recommended GPU is the L40S. ComfyDeploy provisions it for you, so there is nothing to install."
  - q: "Why do the model sizes matter?"
    a: "The workflow notes warn that text encoders and LoRAs are not interchangeable, 1.3B LoRAs do not work on 14B, and VACE only works with T2V models of the matching size."
  - q: "Can the prompt be written automatically?"
    a: "Yes. An LLM Toolkit chain with OpenAIProviderNode can create prompts from your references, using secrets set on the machine or in your environment."
---

## How it works

The workflow is built on ComfyUI-WanVideoWrapper. The model is Wan2.1-T2V-1.3B-Self-Forcing-DMD-FP16, combined with the Wan2_1-VACE_module_1_3B_bf16 module. T5 text encoding uses umt5-xxl-enc-bf16 and decoding uses Wan2_1_VAE_fp32.

Start and end images are loaded, resized with ImageResizeKJv2 and optionally cleaned with BiRefNetRMBG. WanVideoPhantomEmbeds and ImageBatchMulti combine them into the conditioning, while a control video can be run through DepthAnything_V2 (depth_anything_v2_vitl_fp16) or the AIO_Preprocessor from comfyui_controlnet_aux for VACE guidance. WanVideoLoraSelect offers LoRAs such as AccVid, CausVid and Fun-Reward. WanVideoSampler uses a CFG schedule, with SLG and Enhance-A-Video available.

Afterward, ColorAdjustment and LTXVFilmGrain polish the clip and VHS_VideoCombine writes it. Block swap, torch compile and VRAM management nodes are included, and the notes explain that torch compile only helps if you run the same settings repeatedly.

## Tips

- Pick start and end frames with similar framing to get a smooth transition.
- Describe the camera movement in the action prompt.
- Keep 1.3B models, LoRAs and VACE modules matched.
- The default is 81 frames at 24 FPS.
