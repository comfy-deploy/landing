---
title: "First-Last Frame Wan 2.2 Image-to-Video"
seoTitle: "Wan 2.2 First Last Frame Video ComfyUI Workflow"
description: "Generate an in-between video from a start image and an end image with Wan 2.2 I2V 14B. GGUF Q8 and lightning LoRAs. Runs in the cloud on ComfyDeploy."
summary: "Upload a first frame and a last frame and the workflow animates the transition between them using Wan 2.2. Good for animators and creators who want control over where a clip starts and ends."
family: "Wan"
tasks: ["image-to-video"]
inputs: ["Start image", "End image", "Positive prompt", "Negative prompt", "Quality level", "Frame length", "Seed"]
outputs: ["MP4 video that moves from the start frame to the end frame"]
useCases: ["Animate between two keyframes", "Looping or transition clips for motion design", "Storyboard shots with a defined start and end pose", "Cartoon and 2D style motion"]
faq: [{"q": "What GPU does this workflow need?", "a": "It is set to run on an L40S GPU. It uses Q8 GGUF versions of Wan 2.2 to reduce memory use."}, {"q": "How long is the video?", "a": "The length input defaults to 49 frames. You can change it, and the quality setting (HQ, MQ or LQ) controls the resolution."}, {"q": "How do I run it as an API?", "a": "Deploy it on ComfyDeploy and send the two images and prompt to the endpoint. The exposed inputs become the API fields."}]
---

## How it works

The workflow uses the Wan 2.2 two-expert setup: `Wan2.2-I2V-A14B-HighNoise-Q8_0.gguf` and `Wan2.2-I2V-A14B-LowNoise-Q8_0.gguf`, loaded with `UnetLoaderGGUF` from `comfyui-gguf`. Each expert has a matching lightning LoRA (`ligh-i2v_high_noise_model` and `ligh-i2v_low_noise_model`) applied with `LoraLoaderModelOnly`, and `PathchSageAttentionKJ` patches in SageAttention.

The start and end images are resized with `ImageResize+`, then handed to `WanFirstLastFrameToVideo` along with the encoded prompt from `umt5_xxl_fp8_e4m3fn_scaled` and the `wan_2.1_vae`. Two `KSamplerAdvanced` nodes run in sequence, the first for the high-noise expert and the second for the low-noise one.

After decoding, `FastLaplacianSharpen` and `FastFilmGrain` finish the frames, and `CreateVideo` plus `SaveVideo` write the MP4. `easy cleanGpuUsed` and `easy clearCacheAll` free VRAM between stages.

## Tips

- Pick start and end images with the same subject, style and framing so the motion in between stays coherent.
- Write the prompt in sections for subject, scene, motion and aesthetic, like the example in the workflow.
- Keep the default negative prompt, which targets blur, extra fingers and static results.
- Use LQ or MQ quality for quick previews before rendering at HQ.
- Both lightning LoRAs are distilled for speed, so the sampler runs few steps. Raise the frame length only after you are happy with a short test, since longer clips use more memory.
