---
title: "Wan 2.2 Text-to-Video with Lightning LoRA"
seoTitle: "Wan 2.2 Text-to-Video ComfyUI Workflow"
description: "Generate a video from a text prompt with Wan 2.2 T2V 14B and 4-step lightning LoRAs in native ComfyUI. Runs in the cloud on ComfyDeploy."
summary: "Type a prompt, get a short video. This basic Wan 2.2 text-to-video workflow uses the high-noise and low-noise models with fast lightning LoRAs."
family: "Wan"
tasks: ["text-to-video"]
inputs: ["Text prompt", "Negative prompt"]
outputs: ["MP4 video"]
useCases: ["Short clips from a written prompt", "Fast previews of video ideas", "Testing prompts before a longer render", "A baseline Wan 2.2 workflow to build on"]
faq: [{"q": "What GPU does this workflow need?", "a": "It is set to run on an L40S GPU on ComfyDeploy."}, {"q": "How many steps does it use?", "a": "The workflow description says 4 to 7 steps with the lightning LoRAs. The saved settings use 7 total steps split between the two samplers."}, {"q": "How do I run it as an API?", "a": "Deploy it on ComfyDeploy and expose the prompt inputs. The graph uses only core ComfyUI nodes."}]
---

## How it works

This is a 17-node workflow built from core ComfyUI nodes. Wan 2.2 text-to-video uses two models: `wan2.2_t2v_high_noise_14B_fp8_scaled` handles the early, noisy steps and `wan2.2_t2v_low_noise_14B_fp8_scaled` handles the final refinement. Each has its own `Wan2.2-Lightning_T2V-v1.1-A14B-4steps` LoRA (HIGH and LOW), applied with `LoraLoaderModelOnly`.

The prompt is encoded with `umt5_xxl_fp8_e4m3fn_scaled` through `CLIPLoader`. `EmptyHunyuanLatentVideo` creates a latent of 832 by 544 with 81 frames. Two `KSamplerAdvanced` nodes run in sequence with the euler sampler: the first covers steps 0 to 3 and returns leftover noise, and the second continues from step 3 to the end of 7 steps.

`VAEDecode` with `wan_2.1_vae` converts the latent, and `CreateVideo` and `SaveVideo` write the file.

## Tips

- Adjust the latent size and frame count in `EmptyHunyuanLatentVideo` to change resolution and length. More frames take more time and memory.
- The default negative prompt is a long Chinese list that targets overexposure, blur and bad hands, so keep it unless you have a reason to change it.
- Because both LoRAs are lightning versions, keep steps low. Raising them gives little benefit.
- Describe subject, motion and camera in the prompt.
