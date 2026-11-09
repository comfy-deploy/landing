---
title: "Dual Qwen-Edit (Two Reference Images)"
seoTitle: "Qwen-Image-Edit Two Image ComfyUI Workflow"
description: "Experimental Qwen-Image-Edit workflow that uses two reference images and a task preset to combine, restyle or place characters. Runs on ComfyDeploy."
summary: "Give the workflow two images and an instruction, and Qwen-Image-Edit uses both to guide the edit. Useful for combining characters, style transfer and placing subjects together."
family: "Qwen-Image"
tasks:
  - image-editing
inputs:
  - "Reference image 1"
  - "Reference image 2"
  - "Edit instruction"
  - "Task preset"
  - "Aspect ratio"
  - "Seed"
outputs:
  - "Edited image"
useCases:
  - "Placing two characters in the same scene"
  - "Restyling character 1 using image 2 as the style reference"
  - "Combining features of two characters into a new design"
  - "Transferring outfits or accessories between characters"
faq:
  - q: "What GPU does Dual Qwen-Edit need?"
    a: "The recommended GPU is an L40S. It runs qwen_image_edit_fp8_e4m3fn with the 8-step Qwen-Image Lightning LoRA."
  - q: "What are the ALT_LATENT and prompt enhance options?"
    a: "ALT_LATENT is a boolean in the graph. Its note says to turn it on if the second concept has problems and off if you get duplicates. The enhance toggle lets an LLM expand your prompt using the selected task."
  - q: "Does it work every time?"
    a: "The template description calls it experimental and says it works well in some use cases. Try several seeds and adjust the prompt."
---

## How it works

Dual Qwen-Edit is built around the same stack as the single-image workflow: qwen_image_edit_fp8_e4m3fn.safetensors, the qwen_2.5_vl_7b_fp8_scaled text encoder and qwen_image_vae.safetensors. The difference is the speed LoRA, Qwen-Image-Lightning-8steps-V1.1-bf16 (eight steps, versus four in the Fast variant), and the second image input.

You provide two images, input_image1 and input_image2, plus an aspect ratio of Horizontal, Vertical, Squarish or Cinematic. The task dropdown holds a long list of presets, including Integrate Couple, StyleTransfer, Cast Actress, Cast Actor, Relocate Character, Relight and Turnaround Sheet, many with a 4-variations option. The default is Integrate Couple. When enhancing is on, an LLM turns the task and your text into the final edit prompt, and SwitchAny nodes route either that or your manual prompt to the model.

The ALT_LATENT switch changes how the second image is fed to the latent, per its in-graph note.

## Tips

- Pick the task that matches what you want, then use the prompt for details like placement or wardrobe.
- If the second concept is ignored, turn ALT_LATENT on. If characters are duplicated, turn it off.
- Image 1 is generally the subject being edited and image 2 the reference.
- Use the negative prompt note for common artifacts: duplicates, deformed, short legs, big head.
