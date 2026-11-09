---
title: "Flux Kontext Dev Two-Image Edit with NAG"
seoTitle: "Flux Kontext Two Images NAG ComfyUI Workflow"
description: "Combine two characters or images into one with Flux Kontext Dev and NAG, with optional LLM prompt writing. Runs in the cloud on ComfyDeploy with an A100 GPU."
summary: "Upload two images and a short instruction, and Kontext Dev blends them, using NAG so a negative prompt works. Meant for character mashups and design exploration."
family: "Flux Kontext"
tasks: ["image-editing"]
inputs: ["First image", "Second image", "Text prompt", "Negative prompt", "Aspect ratio", "Remove background toggle", "Enhance prompt toggle", "Preference latent toggle", "Steps", "Batch size", "Seed"]
outputs: ["Combined or edited image"]
useCases: ["Blend two characters into a new design", "Merge design elements from two references", "Test negative prompts in Kontext edits", "Concept art iterations"]
faq: [{"q": "What GPU does this workflow need?", "a": "It is set to run on an A100-80GB GPU. It loads the full flux1-kontext-dev model with the t5xxl_fp16 encoder."}, {"q": "How is this different from the Nunchaku version?", "a": "This one loads the standard flux1-kontext-dev with UNETLoader and samples with KSamplerWithNAG. The Nunchaku workflow uses a quantized int4 model for speed."}, {"q": "How do I run it as an API?", "a": "Deploy it on ComfyDeploy and send two images and the prompt. The exposed inputs become API fields."}]
---

## How it works

The workflow loads `flux1-kontext-dev.safetensors` with `UNETLoader`, plus `clip_l`, `t5xxl_fp16` and `ae.safetensors`. It takes two images, resizes each with `ImageResizeKJv2` and `FluxKontextImageScale`, and can remove their backgrounds with `BiRefNetRMBG` set by the remove_background toggle. `ImageStitch` places them next to each other, and `VAEEncode` with `ReferenceLatent` hands both to the model.

A `Preference_Latent` toggle chooses between an empty latent and the first concept as the starting point. The `SwitchAny` nodes route these choices.

Prompting can be automatic. With enhance_prompt on, a system prompt task generator and an OpenAI provider node write a Kontext-style prompt from your instruction. Sampling uses `KSamplerWithNAG` with `FluxGuidance`, so your negative prompt has an effect. `RepeatLatentBatch` creates batches, and an `ImageComparer` shows the result.

## Tips

- Turn on remove_background when you want effects to stay inside the character outline.
- Toggle Preference_Latent to compare starting from an empty latent versus the first concept.
- Add terms like short legs or big head to the negative prompt if you see those problems.
- If no OpenAI key is on the machine, turn enhance_prompt off and write the prompt yourself.
