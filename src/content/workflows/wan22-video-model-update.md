---
title: "Wan 2.2 5B Text-to-Video (ComfyOrg Default)"
seoTitle: "Wan 2.2 5B Text-to-Video ComfyUI Workflow"
description: "The default ComfyOrg Wan 2.2 5B text-to-video workflow with positive and negative prompts. 1280x704, 121 frames. Runs in the cloud on ComfyDeploy."
summary: "Write a prompt and generate a short video with the compact Wan 2.2 5B hybrid model. This is the standard ComfyOrg template and a solid starting point."
family: "Wan"
tasks: ["text-to-video"]
inputs: ["Positive prompt", "Negative prompt"]
outputs: ["MP4 video"]
useCases: ["Short clips from a text prompt", "A baseline to test Wan 2.2 5B", "Prompt experiments before heavier models", "Starting point for custom video workflows"]
faq: [{"q": "What GPU does this Wan 2.2 workflow need?", "a": "It is set to run on an L40S GPU on ComfyDeploy. It uses the 5B model, which is smaller than the 14B Wan 2.2 versions."}, {"q": "Can it do image-to-video too?", "a": "The model is wan2.2_ti2v_5B, a text and image model, and the graph has a Load Image node, but it is bypassed in this saved version. Enable it to start from an image."}, {"q": "How do I run it as an API?", "a": "Deploy it on ComfyDeploy and expose the prompt inputs. It only uses core ComfyUI nodes."}]
---

## How it works

This is a 13-node workflow built from core ComfyUI nodes. `UNETLoader` loads `wan2.2_ti2v_5B_fp16.safetensors`, `CLIPLoader` loads `umt5_xxl_fp8_e4m3fn_scaled`, and `VAELoader` loads `wan2.2_vae`.

The positive and negative prompts go through two `CLIPTextEncode` nodes. `Wan22ImageToVideoLatent` creates the video latent at 1280 by 704 with 121 frames. A `LoadImage` node is connected to it but set to bypass, so the saved workflow behaves as text-to-video.

`ModelSamplingSD3` adjusts the model, then `KSampler` runs 20 steps at CFG 5 with `uni_pc` and the simple scheduler. `VAEDecode` converts the latent, and `CreateVideo` and `SaveVideo` write the MP4. There is no speed LoRA in this one, so it follows the standard sampling settings.

## Tips

- Change the width, height and length in `Wan22ImageToVideoLatent` to trade quality against time.
- Keep the default negative prompt, which targets overexposure, blur and bad hands.
- Enable the Load Image node if you want to start from a picture.
- For fewer steps, look at the Wan 2.2 14B text-to-video workflow, which adds lightning LoRAs.
- Because it is the stock ComfyOrg template, results are a good reference point when you compare it against LoRA-accelerated Wan 2.2 workflows.
