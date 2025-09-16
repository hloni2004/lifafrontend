import React, { useState, useRef } from 'react';
import { Upload, Palette, Package, ArrowRight, Shirt } from 'lucide-react';

interface Color {
    name: string;
    value: string;
    hex: string;
    border?: string;
}

interface TShirtUploadProps {
    onContinue: (data: {
        uploadedImage: string;
        uploadedFileName: string;
        selectedColor: string;
        selectedSize: string;
        name: string;
        description: string;
        quantity: number;
    }) => void;
}

const TShirtUpload: React.FC<TShirtUploadProps> = ({ onContinue }) => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('white');
    const [selectedSize, setSelectedSize] = useState<string>('M');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [notification, setNotification] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const colors: Color[] = [
        { name: 'White', value: 'white', hex: '#ffffff', border: '#e5e7eb' },
        { name: 'Black', value: 'black', hex: '#000000' },
        { name: 'Navy', value: 'navy', hex: '#1e40af' },
        { name: 'Red', value: 'red', hex: '#dc2626' },
        { name: 'Green', value: 'green', hex: '#16a34a' },
        { name: 'Purple', value: 'purple', hex: '#9333ea' },
        { name: 'Orange', value: 'orange', hex: '#ea580c' },
        { name: 'Pink', value: 'pink', hex: '#ec4899' }
    ];

    const sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const showNotification = (message: string): void => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showNotification('Please upload a valid image file');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                showNotification('File size must be less than 10MB');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target && typeof e.target.result === 'string') {
                    setUploadedImage(e.target.result);
                    setUploadedFileName(file.name);
                    showNotification('Image uploaded successfully!');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileUpload = (): void => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const getCurrentColorHex = (): string => {
        const color = colors.find(c => c.value === selectedColor);
        return color ? color.hex : '#ffffff';
    };

    const handleContinue = (): void => {
        if (!uploadedImage) {
            showNotification('Please upload a design first');
            return;
        }
        if (!name.trim()) {
            showNotification('Please enter a product name');
            return;
        }
        if (quantity < 1) {
            showNotification('Quantity must be at least 1');
            return;
        }

        onContinue({
            uploadedImage,
            uploadedFileName,
            selectedColor,
            selectedSize,
            name: name.trim(),
            description: description.trim(),
            quantity
        });
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: 'linear-gradient(to right, #2563eb, #9333ea)',
                    color: 'white',
                    padding: '1rem 1.5rem',
                    borderRadius: '0.75rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    zIndex: 50,
                    fontWeight: '500'
                }}>
                    {notification}
                </div>
            )}

            <header style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                borderBottom: '1px solid #f3f4f6',
                padding: '1rem 0'
            }}>
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '0 1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #2563eb, #9333ea)',
                        padding: '0.5rem',
                        borderRadius: '0.75rem'
                    }}>
                        <Shirt style={{ height: '2rem', width: '2rem', color: 'white' }} />
                    </div>
                    <h1 style={{
                        fontSize: '1.875rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(to right, #2563eb, #9333ea)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        margin: 0
                    }}>
                        Design Your T-Shirt
                    </h1>
                </div>
            </header>

            <main style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2rem 1rem'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth >= 1024 ? '1fr 1fr' : '1fr',
                    gap: '2rem'
                }}>
                    {/* Left Column - Form */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '1rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        padding: '2rem',
                        border: '1px solid #f3f4f6'
                    }}>
                        {/* Upload Section */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color: '#111827',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <Upload style={{ height: '1.5rem', width: '1.5rem', color: '#2563eb' }} />
                                Upload Design
                            </h3>
                            <button
                                onClick={triggerFileUpload}
                                style={{
                                    width: '100%',
                                    border: '2px dashed #d1d5db',
                                    borderRadius: '0.75rem',
                                    padding: '2.5rem',
                                    textAlign: 'center',
                                    transition: 'all 0.3s',
                                    cursor: 'pointer',
                                    background: 'transparent'
                                }}
                            >
                                <Upload style={{
                                    width: '4rem',
                                    height: '4rem',
                                    margin: '0 auto 1rem',
                                    color: '#9ca3af'
                                }} />
                                <p style={{
                                    color: '#6b7280',
                                    fontWeight: '600',
                                    fontSize: '1.125rem'
                                }}>
                                    {uploadedImage ? `✓ ${uploadedFileName}` : 'Click to upload or drag and drop'}
                                </p>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: '#9ca3af',
                                    marginTop: '0.75rem'
                                }}>PNG, JPG, SVG up to 10MB</p>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleImageUpload}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </div>

                        {/* Product Details */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color: '#111827',
                                marginBottom: '1.5rem'
                            }}>Product Details</h3>
                            
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginBottom: '0.5rem',
                                    display: 'block'
                                }}>
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter product name"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginBottom: '0.5rem',
                                    display: 'block'
                                }}>
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter product description"
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem',
                                        resize: 'vertical',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginBottom: '0.5rem',
                                    display: 'block'
                                }}>
                                    Quantity *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color: '#111827',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <Palette style={{ height: '1.5rem', width: '1.5rem', color: '#2563eb' }} />
                                Colors
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '1rem'
                            }}>
                                {colors.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => setSelectedColor(color.value)}
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '0.75rem',
                                            border: selectedColor === color.value ? '3px solid #3b82f6' : '3px solid #d1d5db',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer',
                                            boxShadow: selectedColor === color.value ? '0 0 0 4px rgba(59, 130, 246, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            backgroundColor: color.hex,
                                            transform: selectedColor === color.value ? 'scale(1.1)' : 'scale(1)'
                                        }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#6b7280',
                                marginTop: '0.75rem',
                                textAlign: 'center',
                                textTransform: 'capitalize',
                                fontWeight: '500'
                            }}>
                                Selected: {selectedColor}
                            </p>
                        </div>

                        {/* Size Selection */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color: '#111827',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <Package style={{ height: '1.5rem', width: '1.5rem', color: '#2563eb' }} />
                                Size
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '0.75rem'
                            }}>
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '0.75rem',
                                            border: selectedSize === size ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                                            fontWeight: 'bold',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer',
                                            background: selectedSize === size ? 'linear-gradient(to right, #dbeafe, #ede9fe)' : 'white',
                                            color: selectedSize === size ? '#1d4ed8' : '#374151'
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Continue Button */}
                        <button
                            onClick={handleContinue}
                            disabled={!uploadedImage || !name.trim()}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                padding: '1rem 2rem',
                                background: (!uploadedImage || !name.trim()) ? '#9ca3af' : 'linear-gradient(to right, #2563eb, #9333ea)',
                                color: 'white',
                                borderRadius: '0.75rem',
                                border: 'none',
                                fontWeight: '600',
                                fontSize: '1.125rem',
                                cursor: (!uploadedImage || !name.trim()) ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <span>Continue to Positioning</span>
                            <ArrowRight style={{ height: '1.25rem', width: '1.25rem' }} />
                        </button>
                    </div>

                    {/* Right Column - Preview */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '1rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        padding: '2rem',
                        border: '1px solid #f3f4f6',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#111827',
                            marginBottom: '2rem'
                        }}>Preview</h3>

                        {/* T-Shirt Preview */}
                        <div style={{ position: 'relative', marginBottom: '2rem' }}>
                            <div style={{
                                width: '300px',
                                height: '360px',
                                borderRadius: '1rem',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                transition: 'all 0.5s',
                                position: 'relative',
                                overflow: 'hidden',
                                border: '4px solid #e5e7eb'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    inset: '0',
                                    opacity: 0.95,
                                    clipPath: 'polygon(25% 20%, 25% 18%, 22% 15%, 28% 12%, 35% 10%, 40% 8%, 45% 8%, 55% 8%, 60% 8%, 65% 10%, 72% 12%, 78% 15%, 75% 18%, 75% 20%, 80% 25%, 80% 35%, 78% 33%, 78% 92%, 76% 96%, 24% 96%, 22% 92%, 22% 33%, 20% 35%, 20% 25%)',
                                    backgroundColor: getCurrentColorHex()
                                }} />

                                {uploadedImage && (
                                    <div style={{
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s',
                                        zIndex: 10,
                                        width: '120px',
                                        height: '120px',
                                        left: '50%',
                                        top: '40%',
                                        transform: 'translate(-50%, -50%)'
                                    }}>
                                        <img
                                            src={uploadedImage}
                                            alt="Uploaded design"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain',
                                                borderRadius: '0.5rem',
                                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                                border: '2px solid rgba(255, 255, 255, 0.5)'
                                            }}
                                        />
                                    </div>
                                )}

                                {!uploadedImage && (
                                    <div style={{
                                        position: 'absolute',
                                        inset: '0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <div style={{ textAlign: 'center', opacity: 0.6 }}>
                                            <Upload style={{
                                                height: '3rem',
                                                width: '3rem',
                                                margin: '0 auto 0.75rem',
                                                color: '#9ca3af'
                                            }} />
                                            <p style={{ color: '#9ca3af', fontWeight: '500' }}>Upload your design</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Current Selection Summary */}
                        <div style={{
                            background: 'linear-gradient(to right, #f9fafb, #f3f4f6)',
                            borderRadius: '0.75rem',
                            padding: '1.5rem',
                            border: '1px solid #e5e7eb',
                            width: '100%'
                        }}>
                            <h4 style={{
                                fontWeight: 'bold',
                                color: '#111827',
                                marginBottom: '1rem',
                                fontSize: '1.125rem'
                            }}>Current Selection:</h4>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem',
                                fontSize: '0.875rem'
                            }}>
                                <div>
                                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Name:</span>
                                    <p style={{ fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                                        {name || 'Not set'}
                                    </p>
                                </div>
                                <div>
                                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Quantity:</span>
                                    <p style={{ fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                                        {quantity}
                                    </p>
                                </div>
                                <div>
                                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Color:</span>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginTop: '0.25rem'
                                    }}>
                                        <div style={{
                                            width: '1rem',
                                            height: '1rem',
                                            borderRadius: '0.25rem',
                                            border: '1px solid #d1d5db',
                                            backgroundColor: getCurrentColorHex()
                                        }} />
                                        <span style={{ textTransform: 'capitalize', fontWeight: 'bold', color: '#1f2937' }}>
                                            {selectedColor}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Size:</span>
                                    <p style={{ fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                                        {selectedSize}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TShirtUpload;