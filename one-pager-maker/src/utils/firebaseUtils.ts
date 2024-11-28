import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

interface UploadResult {
  success: boolean;
  url: string;
}

export const uploadFile = async (
  file: File,
  folderName: string
): Promise<UploadResult> => {
  if (!allowedTypes.includes(file.type)) {
    alert("Invalid file type. Please upload only JPEG, PNG, or GIF images.");
    return { success: false, url: "" };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    alert("Image is too large. Please upload images smaller than 5MB.");
    return { success: false, url: "" };
  }

  try {
    const uniqueFileName = `${uuidv4()}-${file.name}`;
    const storageRef = ref(storage, `${folderName}/${uniqueFileName}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { success: true, url };
  } catch (e) {
    if (e instanceof Error) {
      if (e.message.includes("upload")) {
        alert(`Failed to upload image: ${e.message}. Please try again.`);
      } else {
        alert(
          `Failed to retrieve download URL: ${e.message}. Please try again.`
        );
      }
    } else {
      alert("An unknown error occurred. Please try again.");
    }
    return { success: false, url: "" };
  }
};
