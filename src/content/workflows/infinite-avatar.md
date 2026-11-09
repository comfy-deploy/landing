---
title: "Infinite Avatar Talking Video (Wan MultiTalk)"
seoTitle: "Wan MultiTalk Talking Avatar ComfyUI Workflow"
description: "Make a talking character video of any length from a reference image, with LLM dialogue, Chatterbox voice cloning and Wan 2.1 MultiTalk. Runs on ComfyDeploy."
summary: "Give it a reference image and optionally a video to guide the look. An LLM writes the dialogue, Chatterbox speaks it, and MultiTalk animates the character to match."
family: "Wan"
tasks:
  - "avatar-lipsync"
  - "audio"
inputs:
  - "Reference image"
  - "Optional reference video"
  - "Action prompt"
  - "Frame count"
  - "Aspect ratio"
  - "Seed"
outputs:
  - "Talking-character MP4 video"
  - "Generated speech audio"
useCases:
  - "Talking-head characters for stories and ads"
  - "Explainer videos with a consistent virtual presenter"
  - "Dialogue scenes with a cloned voice"
  - "Long clips whose length follows the script"
faq:
  - q: "What GPU does the Infinite Avatar workflow need?"
    a: "The recommended GPU is the L40S. ComfyDeploy provisions it for you, so there is nothing to install."
  - q: "How long can the video be?"
    a: "Length follows the audio. The FRAMES note says to multiply the audio length in seconds by 25 fps and pick the nearest number divisible by 81, since the workflow generates in 81-frame windows."
  - q: "Does the character stay consistent?"
    a: "Yes. The workflow notes say this version keeps a character consistent across the video, unlike the older MultiTalk setup, which generated people randomly."
---

## How it works

The pipeline starts with a reference image, which BiRefNetRMBG can cut out. An optional video loaded with VHS_LoadVideo is only a hint for the LLM about what kind of talking video you want, such as a podcast or street interview. The LLM Toolkit nodes then write the dialogue and a video prompt.

Speech comes from Chatterbox_TTS, which clones a voice. AudioSeparation and AudioCrop prepare the track, and AudioDurationFrames converts its length into a frame count.

Video generation uses the ComfyUI-WanVideoWrapper nodes. WanVideoModelLoader loads Wan2_1-Wan-I2V-MAGREF-14B_fp8_e4m3fn, which holds the character identity from the reference. MultiTalkModelLoader adds WanVideo_2_1_Multitalk_14B_fp8_e4m3fn, driven by Wav2Vec features from the audio. Wan21_Uni3C_controlnet_fp16 adds camera and motion guidance. Three LoRA slots handle speed and quality: lightx2v, MoviiGen and the Fun-Reward LoRA. WanVideoContextOptions lets long clips run in windows. Block swap, VRAM management and torch compile nodes are included for memory and speed.

## Tips

- Set FRAMES using the audio length rule above, otherwise the video and audio drift apart.
- Write the action prompt with camera and motion cues in addition to the speech content.
- Use a clear, front-facing reference image.
- Torch compile only pays off when you run many jobs with the same settings.
