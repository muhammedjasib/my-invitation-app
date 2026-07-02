// Firebase Storage Module
// Handles file uploads and storage operations

const Storage = (() => {
    // Upload image to Firebase Storage
    const uploadImage = async (file, folder = 'invitations') => {
        try {
            if (!file) throw new Error('No file provided');
            
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                throw new Error('Invalid file type. Only images are allowed.');
            }
            
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('File size exceeds 5MB limit');
            }
            
            const userId = localStorage.getItem('userId');
            const timestamp = Date.now();
            const fileName = `${timestamp}_${file.name}`;
            const storagePath = `${folder}/${userId}/${fileName}`;
            
            const storageRef = firebase.storage().ref(storagePath);
            const uploadTask = storageRef.put(file);
            
            return new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload progress:', progress);
                    },
                    (error) => {
                        reject(error);
                    },
                    async () => {
                        const url = await storageRef.getDownloadURL();
                        resolve({
                            url,
                            path: storagePath,
                            name: fileName
                        });
                    }
                );
            });
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    // Upload multiple images
    const uploadImages = async (files, folder = 'invitations') => {
        try {
            const uploads = Array.from(files).map(file => uploadImage(file, folder));
            return await Promise.all(uploads);
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    };

    // Delete file from storage
    const deleteFile = async (storagePath) => {
        try {
            const storageRef = firebase.storage().ref(storagePath);
            await storageRef.delete();
            return true;
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    };

    // Upload background music
    const uploadMusic = async (file) => {
        try {
            if (!file) throw new Error('No file provided');
            
            // Validate file type
            const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'];
            if (!validTypes.includes(file.type)) {
                throw new Error('Invalid audio format. Supported: MP3, WAV, OGG, M4A');
            }
            
            // Validate file size (20MB max)
            if (file.size > 20 * 1024 * 1024) {
                throw new Error('Audio file size exceeds 20MB limit');
            }
            
            return await uploadImage(file, 'music');
        } catch (error) {
            console.error('Error uploading music:', error);
            throw error;
        }
    };

    // Get file download URL
    const getDownloadURL = async (storagePath) => {
        try {
            const storageRef = firebase.storage().ref(storagePath);
            return await storageRef.getDownloadURL();
        } catch (error) {
            console.error('Error getting download URL:', error);
            throw error;
        }
    };

    // Compress image before upload
    const compressImage = async (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob((blob) => {
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        resolve(compressedFile);
                    }, 'image/jpeg', quality);
                };
            };
        });
    };

    return {
        uploadImage,
        uploadImages,
        deleteFile,
        uploadMusic,
        getDownloadURL,
        compressImage
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
