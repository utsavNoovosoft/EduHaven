import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { Dialog } from "@headlessui/react";
import { getCroppedWebpFile } from "@/utils/imageUtils";
import { Button } from "@/components/ui/button";

export const CropModal = ({ isOpen, onClose, imageSrc, onCropDone }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  if (!isOpen) return null;

  const handleCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedImageFile = await getCroppedWebpFile(
      imageSrc,
      croppedAreaPixels
    );
    onCropDone(croppedImageFile);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true">
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-lg">
            <div className="relative h-80">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button 
                variant="secondary"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
