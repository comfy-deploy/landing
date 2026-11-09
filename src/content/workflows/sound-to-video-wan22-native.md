---
title: "Sound-to-Video with Wan 2.2 S2V"
seoTitle: "Wan 2.2 Sound-to-Video Lipsync ComfyUI Workflow"
description: "Make a lip-synced video from an audio track and a reference image with Wan S2V 14B and a lightning LoRA. Native ComfyUI, runs on ComfyDeploy."
summary: "Upload a voice or music track and one reference image, and Wan S2V animates the subject and syncs it to the audio. Good for avatars and talking characters."
family: "Wan"
tasks: ["avatar-lipsync", "image-to-video"]
inputs: ["Reference image", "Audio track", "Text prompt"]
outputs: ["Lip-synced MP4 video"]
useCases: ["Talking characters from a still image", "Lip-sync for voiceovers", "Music-driven animation", "Longer clips by chaining extension chunks"]
faq: [{"q": "What GPU does this workflow need?", "a": "It is set to run on an L40S GPU on ComfyDeploy. It loads Wan2_1-S2V-14B in fp8."}, {"q": "Can I make longer videos?", "a": "Yes. The workflow notes say to copy and paste the Video S2V Extend subgraph, and each copy extends the video by the chunk length, 77 frames by default."}, {"q": "How do I run it as an API?", "a": "Deploy it on ComfyDeploy and expose the image, audio and prompt inputs. The workflow uses a ComfyDeploy node for the output."}]
---

## How it works

The workflow uses core ComfyUI nodes and subgraphs, with no custom packages. `UNETLoader` loads `Wan2_1-S2V-14B_fp8_e5m2_scaled_KJ`, `CLIPLoader` loads `umt5_xxl_fp8_e4m3fn_scaled`, and `VAELoader` loads `wan_2.1_vae`. A `lightx2v_T2V_14B_cfg_step_distill_v2` LoRA is applied through `LoraLoaderModelOnly` so sampling needs only a few steps.

Audio comes in through `LoadAudio` and is encoded with `AudioEncoderLoader` using `wav2vec2_large_english_fp16` and `AudioEncoderEncode`. `WanSoundImageToVideo` combines the audio embeddings, your reference image and the prompt into the video latent. `KSampler` with `ModelSamplingSD3` generates it.

For long audio, extension subgraphs continue the video in chunks, using `LatentCut`, `LatentConcat` and `ImageFromBatch`. A workaround in the notes doubles the first frame and removes it after decoding, because the VAE can overbake the first frame. `CreateVideo` and `SaveVideo` write the MP4.

## Tips

- The notes include a table of steps and cfg for runs with and without the lightning LoRA, so check it before changing sampler settings.
- Use a clear, front-facing image for better lip movement.
- For videos longer than one chunk, add extension subgraphs rather than raising the frame count.
- Describe the setting and mood in the prompt, and let the audio drive the mouth movement.
