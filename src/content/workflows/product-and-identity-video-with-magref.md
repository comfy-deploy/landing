---
title: "MAGREF Multi-Reference Video (Wan 2.1)"
seoTitle: "Wan 2.1 MAGREF Multi-Image Video ComfyUI Workflow"
description: "Generate a video from up to three reference images and a prompt with Wan 2.1 MAGREF 14B in ComfyUI. Products and identities, run on ComfyDeploy."
summary: "Feed up to three concept images, such as a person, a product and a scene, and MAGREF 14B builds one video that keeps them consistent. Includes color grading and film grain."
family: "Wan"
tasks:
  - image-to-video
inputs:
  - "Concept images 1 to 3"
  - "Action prompt"
  - "Resolution preset"
  - "Aspect ratio and quality"
  - "Frames and FPS"
  - "Seed"
outputs:
  - "Video combining the reference subjects"
useCases:
  - "Product videos that show an item with a model"
  - "Keeping a person's identity across a generated scene"
  - "Character plus prop animations"
  - "Concept clips from reference boards"
faq:
  - q: "What GPU does this MAGREF workflow need?"
    a: "It is set to an L40S on ComfyDeploy. It loads the 14B MAGREF model in fp8 with block swap enabled."
  - q: "How many reference images can I use?"
    a: "Three inputs are available, Concept1, Concept2 and Concept3. The workflow notes say to disable the groups you do not need."
  - q: "What resolution options exist?"
    a: "The RESOLUTION input offers I2V480p, I2V720p, T2V1.3B and T2V14B presets."
---

## How it works

Each concept image is loaded and resized with ImageResizeKJv2. An RMBG node can strip the background so only the subject is used, and ImageBatchMulti combines the references.

WanVideoModelLoader from `ComfyUI-WanVideoWrapper` loads `Wan2_1-Wan-I2V-MAGREF-14B_fp8_e4m3fn.safetensors`, with the lightx2v distillation LoRA (`Wan21_T2V_14B_lightx2v_cfg_step_distill_lora_rank32`). Text uses `umt5-xxl-enc-bf16.safetensors`, CLIP vision uses `clip_vision_h.safetensors`, and WanVideoImageToVideoEncode builds the conditioning.

The sampler stage adds WanVideoTeaCache, WanVideoSLG, WanVideoEnhanceAVideo and a CFG schedule list. After WanVideoDecode, ColorAdjustment and LTXVFilmGrain finish the look, and VHS_VideoCombine writes the video at your FPS.

## Tips

- Describe how each reference interacts in the action prompt, for example who holds which item.
- Use clear subject images with simple backgrounds. Background removal is part of the graph.
- Use fewer frames or the 480p preset for fast tests. The default length is 81 frames.
- Set quality to LQ or MQ while iterating and HQ for the final pass.

## Run it as an API

You can deploy this workflow on ComfyDeploy as a hosted API endpoint. The inputs listed above become the request fields, so your own app can submit them and receive the finished result without running ComfyUI yourself. The same workflow can also be run and shared from the ComfyDeploy playground in your browser.

Because everything runs on cloud GPUs, you do not need to install the custom nodes or download the model files yourself.
