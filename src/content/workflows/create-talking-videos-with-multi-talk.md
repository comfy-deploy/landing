---
title: "Talking Videos with Wan 2.1 MultiTalk"
seoTitle: "Wan 2.1 MultiTalk Talking Video ComfyUI Workflow"
description: "Make talking videos from audio and a reference image or video with Wan 2.1 and MultiTalk, with LLM prompts. Runs in the cloud on ComfyDeploy."
summary: "Feed in a voice track and a reference image or video, and this workflow generates a video where the subject speaks in sync. It suits creators making talking-head clips and character videos."
family: "Wan"
tasks: ["avatar-lipsync", "text-to-video"]
inputs: ["Reference image or video", "Audio clip", "Action prompt", "Aspect ratio", "Resolution mode", "Frame count", "Quality level", "Seed"]
outputs: ["Lip-synced MP4 video"]
useCases: ["Talking-head clips from a still portrait", "Character dialogue scenes with a written action prompt", "Vertical short-form videos", "Prototype speaking avatars for a product"]
faq: [{"q": "What GPU does this MultiTalk workflow need?", "a": "It is configured for an L40S GPU on ComfyDeploy. It loads the 14B Wan 2.1 model in fp8 with block swap to manage VRAM."}, {"q": "Which models does it use?", "a": "It uses Wan2_1-T2V-14B_fp8_e4m3fn with the WanVideo_2_1_Multitalk_14B_fp8 model, plus the FusionX and lightx2v distill LoRAs. Wav2Vec handles the audio embeddings."}, {"q": "How do I run it as an API?", "a": "Deploy it on ComfyDeploy and send the image or video, audio and prompt to the endpoint. The external input nodes define the API fields."}]
---

## How it works

The workflow is built on the `ComfyUI-WanVideoWrapper` nodes. `WanVideoModelLoader` loads `Wan2_1-T2V-14B_fp8_e4m3fn` together with the `MultiTalkModelLoader` weights, and two LoRA selectors add `Wan2.1_T2V_14B_FusionX_LoRA` and the `lightx2v` cfg-step distill LoRA, which allow fewer sampling steps.

Audio is loaded with `LoadAudio`, optionally cropped with `AudioCrop`, and split into voice and background with `AudioSeparation`. `DownloadAndLoadWav2VecModel` and `MultiTalkWav2VecEmbeds` convert the speech into conditioning for the lips and face.

Your reference image (or video, via `VHS_LoadVideo`) can have its background removed with `BiRefNetRMBG`. A `VideoResolutionSelector` chooses the size from the aspect ratio and quality setting (HQ, MQ or LQ). An optional LLM step, using an OpenAI provider node, turns your action prompt into a fuller description.

After decoding, the video can get color adjustment and `LTXVFilmGrain`, and `VHS_VideoCombine` muxes the audio back in.

## Tips

- Set the frame count to match your audio length, since the audio is what drives the animation.
- The RESOLUTION option offers I2V480p, I2V720p, T2V1.3B and T2V14B, so pick a smaller one for quick tests.
- Use a clean, front-facing portrait with the face clearly visible for the best sync.
- The LLM prompt step needs an OpenAI key on the machine. Without it, type the full action prompt yourself.
