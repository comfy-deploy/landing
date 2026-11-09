---
title: "Voice Cloning with Chatterbox"
seoTitle: "Chatterbox Voice Cloning ComfyUI Workflow"
description: "Clone a voice from reference audio using Chatterbox in ComfyUI, with audio cropping and vocal separation. Runs in the cloud on ComfyDeploy."
summary: "Load a source recording and a reference voice, and Chatterbox converts the speech to sound like the reference. A text-to-speech branch is included for typed text."
family: "Other"
tasks: ["audio"]
inputs: ["Source audio", "Reference voice audio", "Text for speech", "Seed"]
outputs: ["Cloned-voice audio file"]
useCases: ["Re-voice a recording", "Narration in a reference voice", "Clean vocals before cloning", "Prototype voices for video projects"]
faq: [{"q": "What GPU does this voice cloning workflow need?", "a": "It is set to run on an L40S GPU on ComfyDeploy. Both Chatterbox nodes are set to the cuda device."}, {"q": "Does it do text-to-speech?", "a": "The graph includes a Chatterbox_TTS node with a text input, but it is bypassed in the saved version. The active path is voice conversion with Chatterbox_VC."}, {"q": "How do I run it as an API?", "a": "Deploy it on ComfyDeploy and send the audio inputs to the endpoint. It is a small 13-node graph using one custom package."}]
---

## How it works

This is a small audio-only workflow. It uses the `audio-separation-nodes-comfyui` package plus the Chatterbox nodes, and loads no image or video models.

Three `LoadAudio` nodes bring in the source recording and reference audio. `AudioCrop` trims a clip to the part you want, and `AudioSeparation` splits vocals from the rest so the voice is isolated before conversion.

The core step is `Chatterbox_VC`, which converts the source speech to the reference voice on the cuda device. The graph also contains a `Chatterbox_TTS` node with an exposed text field, with the sample text from the ERNIE 4.5 documentation, with a few numeric controls. In the saved workflow that node is bypassed, so you would enable it to generate speech from typed text. `SaveAudio` writes the results and `PreviewAudio` lets you listen.

## Tips

- Use a clean reference clip of a single speaker with little background noise.
- Run the audio separation step first when your source has music or noise.
- Crop to a short, representative section when testing.
- To use text-to-speech, enable the bypassed TTS node and give it a reference clip.
