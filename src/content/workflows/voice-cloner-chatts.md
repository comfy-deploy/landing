---
title: "Voice Cloner with Chatterbox TTS"
seoTitle: "Chatterbox Voice Cloning ComfyUI Workflow"
description: "Clone a voice from an audio sample and make it read your text with Chatterbox TTS in ComfyUI. Optional LLM script help, run in the cloud on ComfyDeploy."
summary: "Give it a short voice sample and a script, and Chatterbox TTS reads the script in that voice. It can also use a default voice or have an LLM write the line from an image."
family: "Other"
tasks:
  - audio
inputs:
  - "Voice sample audio"
  - "Script text (audio prompt)"
  - "Optional image for auto prompt"
  - "Default voice and auto prompt toggles"
  - "Seed"
outputs:
  - "Cloned-voice audio file"
useCases:
  - "Narration in a chosen voice"
  - "Voiceovers for talking avatar videos"
  - "Prototyping character dialogue"
  - "Reading short scripts in a cloned voice"
faq:
  - q: "What GPU does this voice cloner need?"
    a: "It is configured for a T4 on ComfyDeploy."
  - q: "How does the cloning work?"
    a: "The Chatterbox_TTS node takes your audio sample as the voice reference and speaks the text you provide."
  - q: "What does the auto prompt switch do?"
    a: "With it on, an LLM node writes the line for you from the input image. With it off, your own AUDIO_PROMPT text is used."
---

## How it works

An audio input supplies the voice sample, which AudioSeparation from `audio-separation-nodes-comfyui` can clean up by isolating the vocals, and AudioCrop trims it to a usable length. SwitchAny nodes route between your sample and a default voice depending on the toggles.

The Chatterbox_TTS node is the core. It reads the text from the audio prompt and speaks it in the reference voice. SaveAudio stores the result.

For the optional auto prompt, an input image is resized with ImageResizeKJv2, and an OpenAIProviderNode with LLMToolkitTextGeneratorStream and PromptManager from `llm-toolkit` writes the line to be spoken. Display_Text and PreviewAny nodes show the text used.

## Tips

- Use a clear sample of one speaker with little noise or music. The vocal isolation step helps, but clean input is better.
- Keep each script short, since Chatterbox works best on short passages.
- Turn on default voice to test the script before you use your own sample.
- Change the seed to get a different delivery of the same text.

## Run it as an API

You can deploy this workflow on ComfyDeploy as a hosted API endpoint. The inputs listed above become the request fields, so your own app can submit them and receive the finished result without running ComfyUI yourself. The same workflow can also be run and shared from the ComfyDeploy playground in your browser.
