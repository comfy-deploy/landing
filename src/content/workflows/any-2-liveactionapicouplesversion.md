---
title: "Any-2-LiveAction: Couples Edition"
seoTitle: "Anime to Live Action Couples ComfyUI Workflow"
description: "Cast real actors in the roles of anime or game characters, turn a couple into live action with Flux Kontext, then animate it with Kling. Runs on ComfyDeploy."
summary: "Restyle a character couple into live-action tokusatsu-style scenes with chosen actors, then animate the result. A large 223-node pipeline that needs API keys."
family: "Flux Kontext"
tasks:
  - image-editing
  - image-to-video
inputs:
  - "Character images"
  - "Actor and actress photos"
  - "Manual prompts for actor, actress, couple and action"
  - "Aspect ratio"
  - "FPS and frame count"
  - "Face boost model"
  - "Seed"
outputs:
  - "Live-action style image"
  - "Animated video"
useCases:
  - "Casting real people as anime or game characters"
  - "Live-action fan film and tokusatsu style stills"
  - "Short animated clips from the converted stills"
  - "Face-consistent character adaptations"
faq:
  - q: "What GPU does Any-2-LiveAction need?"
    a: "The recommended GPU is an A10G. The heavy image and video generation uses external APIs, while the GPU handles face swapping, background removal and image processing."
  - q: "What API keys does it need?"
    a: "The description says Kling and Kontext need secrets on the machine. It also says to set OPENAI_API_KEY for automatic prompts and to have FAL_API or API_KEY_COMFY_ORG available."
  - q: "What does the ACTOR_IS_ON_RIGHT_SIDE input do?"
    a: "It tells the workflow which side of the original image the male character is on. The in-graph notes say 1 if the man is on the right and 0 otherwise, and that it works most of the time."
---

## How it works

This is the largest pipeline in the set, with 223 nodes. Per the description, it uses Flux Kontext through an API to convert characters to live action, and Kling through the fal-api package to animate the result.

Inputs include the original character image, photos of the actor and actress, and separate manual prompts for the actress, actor, couple and action. A switch tells the graph on which side the actor stands. With OPENAI_API_KEY set, an llm-toolkit node (default gpt-4.1-mini) can write the prompts instead.

For identity, the graph uses ReActor face swap and ReActorFaceBoost with models such as inswapper_128.onnx, GPEN-BFR-512 and codeformer-v0.1.0, and the boost_model input picks the restorer. BiRefNetRMBG removes backgrounds, AILab_ImageStitch combines images, depth_anything_v2_vitl_fp16 and ControlNet-aux provide depth information, and LTXVFilmGrain and ColorAdjustment finish the frames. Many Image Comparer and PreviewImage nodes show intermediate results.

## Tips

- Set the actor side value correctly, since the couple prompt depends on it.
- Use clear, front-facing actor photos for the best face match.
- Try a different face boost model if skin or eyes look off.
- Use the 9:16 aspect ratio default for vertical clips, or switch to 16:9 or 1:1.
