import * as yup from "yup";
import { validateBufferMIMEType } from "validate-image-type";

export const imagesServiceSchema = yup
  .mixed<Express.Multer.File>()
  .test("valid-image", "The uploaded file is not a valid image", async (file) => {
    if (!file) return true;
    const result = await validateBufferMIMEType(file.buffer, {
      allowMimeTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"],
    });
    return result.ok;
  });
