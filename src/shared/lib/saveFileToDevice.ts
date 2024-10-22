const saveFileToDevice = (response: File, fileName?: string) => {
  if (response instanceof Blob) {
    const fileUrl = URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = response.name ?? fileName;
    link.click();
    URL.revokeObjectURL(fileUrl);
  }
};

export default saveFileToDevice;
