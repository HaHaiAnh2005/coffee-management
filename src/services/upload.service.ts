export const uploadService = {
  uploadImage: async (file: File): Promise<string> => {
    // Mock upload URL
    return URL.createObjectURL(file);
  },
};
