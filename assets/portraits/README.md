# About portraits

- `axel-outdoor-4k.jpg`: original supplied outdoor photo, 3024 × 4032. No generative changes.
- `axel-studio-4k.jpg`: 3840 × 3840 export of an AI-assisted restoration of the supplied 200 × 200 photo. Its added facial detail is reconstructed, not recovered camera detail; likeness cannot be guaranteed pixel for pixel.
- `800` and `1600` derivatives refer to maximum edge length. The browser selects appropriately sized files through `srcset`.

The studio restoration used the built-in image-generation tool. Prompt: conservative photographic resolution restoration of the original portrait; preserve identity, facial proportions, expression, skin tone, hairline, beard, white shirt, pose, framing and background; remove JPEG artifacts without beautifying, reshaping, changing clothing, stylizing, or creating a new scene. The generated 1254 × 1254 restoration was exported to 3840 × 3840. The original photo remains at `assets/axel.jpeg`.
