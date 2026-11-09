---
title: "Branding Product Shot with Seedream 4 (Dual Input)"
seoTitle: "Seedream 4 Logo on Product ComfyUI Workflow"
description: "Place your logo or label on a product photo with Seedream 4 using two input images and a prompt. Runs in the cloud on ComfyDeploy, no GPU required."
summary: "Upload a product photo and a logo, describe the placement, and Seedream 4 produces a branded product shot. Aimed at brands and e-commerce teams mocking up packaging and merch."
family: "Seedream"
tasks: ["image-editing"]
inputs: ["Product image", "Logo or second reference image", "Task preset", "Text prompt", "Seed"]
outputs: ["Branded product image"]
useCases: ["Wrap a logo around a can or bottle", "Print a logo on apparel so it follows the fabric", "Add a prop or hand holding the product", "Outfit or accessory swaps on a model photo"]
faq: [{"q": "What GPU does this Seedream workflow need?", "a": "None. The GPU is listed as CPU because generation is done by the Seedream v4 model through an API node, not on a local GPU."}, {"q": "Do I need an API key?", "a": "The prompt helper uses an OpenAI-based LLM node, which needs an OPENAI_API_KEY secret on the machine. Without it, write the full prompt yourself and remove the system prompt."}, {"q": "How do I run this as an API?", "a": "Deploy it on ComfyDeploy and call the endpoint with the two images, task, prompt and seed. The playground inputs map directly to API fields."}]
---

## How it works

The workflow takes two images through `ComfyUIDeployExternalImage` nodes, resizes and pads each one with `ResizeAndPadImage`, and merges them with `ImageBatch`. A `ResolutionSelector` sets the output size.

Generation is handled by the `GenerateImage` node with a `ConfigGenerateImageSeedream` config set to `seedream_v4`, so the heavy work happens on Seedream rather than on your own machine. An `APIProviderSelectorNode` picks the provider.

The prompt side uses the `llm-toolkit` package: an `LLMPromptManager` and a task generator turn your short instruction into a full prompt based on a task list. The list includes Text/Logo Add or Replace (Perspective-Aware), Prop Add/Swap, Outfit Try-On, Accessory Swap and Single-Hand Holding/Product Placement Consistency, among others. The default is `5 Prop Add/Swap (Placement-Aware)`.

## Tips

- For logos, pick the `6 Text/Logo Add or Replace (Perspective-Aware)` task so the logo follows the surface instead of floating on top.
- Mention the material in your prompt, for example that the logo should wrap with the fabric and look like part of the same material.
- Keep the logo image clean and on a plain background so it is easy to isolate.
- If the LLM step is unavailable, write the whole instruction manually, such as which image to take the product from and which to take the logo from.
