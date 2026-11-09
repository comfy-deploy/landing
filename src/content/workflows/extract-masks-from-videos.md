---
title: "Video Matting: Extract Masks From Videos"
seoTitle: "ComfyUI Video Mask Extraction Workflow"
description: "Extract the foreground and a matte mask from any video with Robust Video Matting in ComfyUI. Upload a clip and run it in the cloud on ComfyDeploy."
summary: "Upload a video and get back the isolated foreground and a mask video of the subject. Useful for compositing and as a mask source for other video workflows."
family: "Other"
tasks:
  - video-editing
inputs:
  - "Input video"
outputs:
  - "Foreground video"
  - "Mask video"
useCases:
  - "Cutting a person out of footage without a green screen"
  - "Making mask clips for compositing in an editor"
  - "Preparing subject masks for later video effects"
  - "Quick background removal tests"
faq:
  - q: "What GPU does this video mask workflow need?"
    a: "It runs on an A10G on ComfyDeploy. The graph is small, with only 8 nodes."
  - q: "Which model extracts the mask?"
    a: "The Robust Video Matting node, set to the resnet50 variant."
  - q: "How do I run it as an API?"
    a: "Deploy it on ComfyDeploy and send a video to the input_video input. The foreground and mask videos are the outputs."
---

## How it works

The video input feeds a VHS_LoadVideo node from the VideoHelperSuite, which splits the clip into frames. An ImageScaleBy node scales the frames before processing, which keeps the matting step fast on longer clips.

The scaled frames go into the Robust Video Matting node using the resnet50 variant. It produces a foreground image sequence and an alpha matte for every frame. A MaskToImage node converts the matte into a viewable grayscale image sequence.

Three VHS_VideoCombine nodes then assemble the results into videos, so you can save the foreground and the mask separately.

## Tips

- Shoot or choose footage where the subject is clearly separated from the background. Matting models handle hair and soft edges well, but busy scenes are harder.
- Lower the ImageScaleBy factor for long videos to cut processing time. Raise it when you need finer edges.
- Use the mask video as a track matte in your editor, or feed it to other ComfyUI video workflows that accept masks.
- Keep the clip short while testing, then run the full video.

## Run it as an API

With a single video input, this workflow is simple to deploy on ComfyDeploy as an endpoint that returns the foreground and mask.
