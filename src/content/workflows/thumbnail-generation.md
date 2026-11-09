---
title: "YouTube Thumbnail Generator (Kontext Max)"
seoTitle: "YouTube Thumbnail Generator ComfyUI Workflow"
description: "Make a YouTube thumbnail from your face photo and video title with an LLM-written prompt and Flux Kontext Max. Runs in the cloud on ComfyDeploy."
summary: "Upload a face photo and type your video title. An LLM writes the thumbnail prompt and Flux Kontext Max draws it with your face. For YouTubers and video editors."
family: "Flux Kontext"
tasks:
  - image-editing
  - text-to-image
inputs:
  - "Face photo"
  - "Video title"
  - "LLM model name"
outputs:
  - "Thumbnail image"
useCases:
  - "Thumbnails for YouTube videos"
  - "A/B testing several thumbnail concepts per title"
  - "Social cover images with a consistent face"
  - "Batch thumbnails through an API"
faq:
  - q: "What GPU does the thumbnail workflow need?"
    a: "It runs on CPU. The image comes from the Flux Kontext Max node, which is an external API call, and the title prompt is written by an LLM, so no GPU is needed."
  - q: "Can I put text on the thumbnail?"
    a: "Yes. The input note says to put important text between quotation marks in the title, for example a number. It also warns that copyrighted or NSFW titles or images may fail."
  - q: "How do I run the thumbnail workflow as an API?"
    a: "Deploy it on ComfyDeploy and call the endpoint with a face image and a video title. The result is returned from the API response."
---

## How it works

The graph has only 14 nodes and loads no local models.

You provide a face photo, a video title and an LLM name (default gpt-4.1-mini). The title is combined with fixed text by ComfyUIDeployStringCombine, and an LLMToolkitTextGenerator node using an OpenAIProviderNode turns it into a detailed thumbnail prompt. ShowText and Display_Text nodes let you read it.

That prompt and your face image go to FluxKontextMaxImageNode, which calls Flux Kontext Max to draw the thumbnail with your likeness. CheckImageEmpty and a SwitchAny node handle the case where no image is supplied, so the workflow can still pick a valid path. SaveImage stores the result.

The example title is a challenge-style headline in quotation marks, which shows how to mark text you want rendered in the image.

## Tips

- Use a clear, front-facing photo with good lighting for the best likeness.
- Wrap text you want to appear on the thumbnail in quotation marks.
- Avoid copyrighted characters and sensitive content, since the template warns those may fail to generate.
- An OpenAI key in machine secrets is needed for the prompt step.
