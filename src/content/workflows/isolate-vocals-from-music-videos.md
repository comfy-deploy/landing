---
title: "Isolate Vocals from Music and Video Audio"
seoTitle: "ComfyUI Vocal Isolation Workflow (Audio Separation)"
description: "Separate vocals from the audio of a music video or clip with the AudioSeparation node in ComfyUI. Get an MP3 of the voice, run in the cloud on ComfyDeploy."
summary: "Pick a clip and get an MP3 with the vocals isolated from the music. A five-node workflow built on the audio separation custom nodes."
family: "Other"
tasks:
  - audio
inputs:
  - "Audio or video file"
outputs:
  - "Isolated vocals as MP3"
  - "Audio preview"
useCases:
  - "Pulling a voice track out of a music video"
  - "Preparing clean voice samples for voice cloning"
  - "Making acapella clips"
  - "Removing backing music before transcription"
faq:
  - q: "What GPU does vocal isolation need?"
    a: "It runs on an A10G on ComfyDeploy. The graph has only five nodes."
  - q: "What does it output?"
    a: "An MP3 of the separated vocals, saved with SaveAudioMP3, plus a preview in the graph."
  - q: "How do I run it as an API?"
    a: "Deploy it on ComfyDeploy and pass the file selection to the audio input. The MP3 is returned as the output."
---

## How it works

This is a short pipeline. The audio input is a selection of files available on the machine, and a LoadAudio node reads the chosen file, including the soundtrack of video files such as MP4.

The audio goes into the AudioSeparation node from the `audio-separation-nodes-comfyui` package. It splits the track into stems, and the workflow uses the vocals output. A SaveAudioMP3 node saves the vocals as an MP3 and PreviewAudio lets you listen in the interface.

There are no diffusion models involved, which is why it runs on a smaller A10G GPU and finishes quickly.

## Tips

- Use the highest quality source you have. Compressed or very noisy audio leaves more music bleed in the vocals.
- Songs with a clear lead vocal separate best. Dense choir parts may keep some backing.
- The isolated MP3 works as a clean voice sample for the voice cloning workflows on this site.
- Trim long files first if you only need a section.

## Run it as an API

You can deploy this workflow on ComfyDeploy as a hosted API endpoint. The inputs listed above become the request fields, so your own app can submit them and receive the finished result without running ComfyUI yourself. The same workflow can also be run and shared from the ComfyDeploy playground in your browser.
