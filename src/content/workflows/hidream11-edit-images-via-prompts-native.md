---
title: "HiDream E1.1 Image Editing by Prompt"
seoTitle: "HiDream E1.1 Image Edit ComfyUI Workflow"
description: "Edit an image with a text instruction using HiDream E1.1 in native ComfyUI. Upload a picture and describe the change. Runs on ComfyDeploy in the cloud."
summary: "Load an image, type what you want changed, and HiDream E1.1 produces the edited version. A native ComfyUI implementation with no custom nodes."
family: "HiDream"
tasks: ["image-editing"]
inputs: ["Image to edit", "Edit instruction prompt", "Negative prompt"]
outputs: ["Edited image"]
useCases: ["Change colors or objects with a plain instruction", "Style changes to a photo", "Quick edits without drawing a mask", "Compare HiDream editing with other editors"]
faq: [{"q": "What GPU does this HiDream E1.1 workflow need?", "a": "It is set to run on an L40S GPU on ComfyDeploy."}, {"q": "Which models does it load?", "a": "It uses hidream_e1_1_bf16 as the diffusion model, with clip_l, clip_g, t5xxl and llama_3.1_8b_instruct text encoders, and ae.safetensors as the VAE."}, {"q": "How do I run it as an API?", "a": "Deploy it on ComfyDeploy and expose the image and prompt inputs. The workflow has no custom nodes, so setup is straightforward."}]
---

## How it works

The workflow is built entirely from core ComfyUI nodes. `UNETLoader` loads `hidream_e1_1_bf16.safetensors`, and `QuadrupleCLIPLoader` loads the four text encoders HiDream needs: `clip_l_hidream`, `clip_g_hidream`, `t5xxl_fp8_e4m3fn_scaled` and `llama_3.1_8b_instruct_fp8_scaled`. The VAE is `ae.safetensors`.

Your image is loaded with `LoadImage` and resized with `ImageScaleToTotalPixels`. `InstructPixToPixConditioning` combines the positive prompt, the negative prompt, the VAE and the image into conditioning for editing. `RescaleCFG` adjusts the model output, and `DualCFGGuider` guides the sampling.

`SamplerCustomAdvanced` runs with `RandomNoise`, `KSamplerSelect` and `BasicScheduler`, then `VAEDecode` produces the final image. The default negative prompt is simply low quality, blurry, distorted.

## Tips

- Write the prompt as an instruction describing the change, for example what to recolor or add.
- The workflow includes links to the model files in its notes, so check that all files are in place if a node reports an error.
- Because `ImageScaleToTotalPixels` sets the working size, smaller values run faster at the cost of detail.
- Keep the edit focused on one change at a time for more predictable results.
- The model files are large because HiDream uses four text encoders, so the first run on a fresh machine takes longer than later runs.
