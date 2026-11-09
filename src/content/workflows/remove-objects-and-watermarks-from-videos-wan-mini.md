---
title: "Remove Video Objects and Watermarks (Wan)"
seoTitle: "Wan MiniMax-Remover Video Object Removal ComfyUI Workflow"
description: "Erase objects and watermarks from video with Wan 2.1 MiniMax-Remover, Florence2 and BiRefNet masks, and VACE. Quality presets, runs on ComfyDeploy."
summary: "Upload a video and say what to remove. Florence2 and BiRefNet build the masks, and Wan MiniMax-Remover fills the area across all frames."
family: "Wan"
tasks:
  - "video-editing"
inputs:
  - "Input video"
  - "Description of what to remove"
  - "Resolution mode"
  - "Aspect ratio"
  - "Quality (HQ, MQ, LQ)"
  - "Frames and FPS"
  - "Seed"
outputs:
  - "Cleaned MP4 video"
useCases:
  - "Removing watermarks or logos from clips"
  - "Deleting people or objects from footage"
  - "Cleaning up product videos"
  - "Preparing b-roll with distractions removed"
faq:
  - q: "What GPU does the video object remover need?"
    a: "The recommended GPU is the L40S. ComfyDeploy provisions it for you, so there is nothing to install."
  - q: "How does it find what to remove?"
    a: "It uses DownloadAndLoadFlorence2Model to locate objects from text, and BiRefNetRMBG for segmentation masks. SolidMask and ImageCompositeMasked help build the final mask."
  - q: "Can I pick the quality?"
    a: "Yes. The quality input has HQ, MQ and LQ options, and the RESOLUTION input offers I2V480p, I2V720p, T2V1.3B and T2V14B."
---

## How it works

The video is loaded with VHS_LoadVideo and resized with ImageResizeKJv2 using the selected resolution and aspect ratio. Masks are created with Florence2 (comfyui-florence2) and BiRefNetRMBG, then combined with MaskToImage, SolidMask and ImageCompositeMasked.

Removal uses the ComfyUI-WanVideoWrapper nodes. WanVideoModelLoader works with Wan2_1-MiniMaxRemover_1_3B_fp16, and WanVideoVACEModelSelect adds Wan2_1-VACE_module_1_3B_bf16. WanVideoMiniMaxRemoverEmbeds prepares the source frames and mask. Two LoRAs, Wan2.1_T2V_14B_FusionX and lightx2v cfg step distill, speed up sampling. WanVideoSampler runs with the unipc scheduler, and encoding and decoding use Wan2_1_VAE_bf16 and umt5-xxl-enc-bf16 for text.

Optional helpers include TeaCache, SLG, Enhance-A-Video, block swap, VRAM management and torch compile. The output goes through ColorAdjustment and LTXVFilmGrain, then VHS_VideoCombine writes the MP4. An LLM node (OpenAIProviderNode) can help phrase the removal text.

## Tips

- Use short, specific object names, such as the logo in the corner, for the Florence2 step.
- Start with LQ or MQ to check the mask, then switch to HQ for the final render.
- Watermarks that move or fade are harder, so check the full clip.
- The 81-frame default fits Wan models. Longer clips cost more time.
