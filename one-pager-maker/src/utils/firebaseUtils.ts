import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const uploadFile = async (
  file: File,
  folderName: string
): Promise<string> => {
  if (file.size > MAX_IMAGE_SIZE) {
    alert("Image is too large. Please upload images smaller than 5MB.");
    return "";
  }

  try {
    const uniqueFileName = `${uuidv4()}-${file.name}`;
    const storageRef = ref(storage, `${folderName}/${uniqueFileName}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (e) {
    alert(`Failed to upload image: ${e?.toString()}. Please try again.`);
  }
  return "";
};
