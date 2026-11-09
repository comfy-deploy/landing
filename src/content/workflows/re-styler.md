---
title: "Re-Styler: Stylized Profile Pictures with Kontext"
seoTitle: "Flux Kontext Profile Picture Styler ComfyUI Workflow"
description: "Turn a portrait into stylized profile pictures with Flux Kontext Dev and a style preset list. Fast Nunchaku model. Runs in the cloud on ComfyDeploy."
summary: "Upload a portrait, pick a style, and get a creative restyled picture for avatars and profile photos. Other kinds of images also work."
family: "Flux Kontext"
tasks: ["image-editing"]
inputs: ["Portrait image", "Style preset", "Manual prompt", "Aspect ratio", "Seed"]
outputs: ["Stylized portrait image"]
useCases: ["Creative profile pictures", "Collage and poster-style portraits", "Social media avatars", "Style experiments on any photo"]
faq: [{"q": "What GPU does this workflow need?", "a": "It is set to run on an L40S GPU on ComfyDeploy. It uses the Nunchaku int4 Kontext model for speed."}, {"q": "Which styles can I pick?", "a": "The style input is a list of presets. The saved default is GTA Pricedown Collage, and you can add your own text in the manual prompt field."}, {"q": "How do I run it as an API?", "a": "Deploy it on ComfyDeploy and send the portrait, style and prompt to the endpoint. The inputs map to API fields."}]
---

## How it works

The workflow loads `svdq-int4_r32-flux.1-kontext-dev` as a Nunchaku model together with the `FLUX.1-turbo-Alpha` LoRA, `clip_l`, `t5xxl_fp16` and `ae.sft`. The Nunchaku quantization and the turbo LoRA keep generation fast.

Your portrait is resized, can have its background removed with `BiRefNetRMBG`, and is scaled with `FluxKontextImageScale`. It is encoded with `VAEEncode` and attached with `ReferenceLatent` so Kontext keeps the person's identity.

The style comes from the `llm-toolkit` nodes. A `StylePromptGenerator` and `SystemPromptTaskGenerator` build a Kontext prompt from your chosen style and the manual prompt, which defaults to the person. A `LocalTransformersProviderNode` can run the text step locally. `FluxGuidance` sets guidance, `ConditioningZeroOut` handles the negative side, and `KSampler` renders the result.

A `ResolutionSelector` picks the size from the aspect ratio.

## Tips

- Use a clear portrait with the face fully visible.
- Try different style presets with the same seed to compare looks.
- Use the manual prompt to describe who is in the picture, such as the person, or add details to keep.
- Vertical works well for profile photos, and you can switch the aspect ratio for banners.
