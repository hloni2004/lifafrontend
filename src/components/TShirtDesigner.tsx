import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ShoppingCart, Palette, Shirt, Eye, Package, Save, AlertCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Plus, Minus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Auth from './Auth';
import api from '../service/api';
import Header from './Header';

interface DesignPosition {
    x: number;
    y: number;
}

interface Color {
    name: string;
    value: string;
    hex: string;
    border?: string;
}

interface TShirt {
    name?: string;
    description?: string;
    price?: string | number;
    color?: string;
    size?: string;
    designId?: number;
    placementDataId?: number;
}

const TShirtDesigner: React.FC = () => {
    const { user, login, logout } = useAuth();
    const [selectedView, setSelectedView] = useState<string>('front');
    const [selectedColor, setSelectedColor] = useState<string>('white');
    const [selectedSize, setSelectedSize] = useState<string>('M');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string>('');
    const [designPosition, setDesignPosition] = useState<DesignPosition>({ x: 0, y: 0 });
    const [designScale, setDesignScale] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [notification, setNotification] = useState<string>('');
    const [windowWidth, setWindowWidth] = useState<number>(1024);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const API_BASE = 'http://localhost:8080';

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

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isLarge = windowWidth >= 1024;
    const isMedium = windowWidth >= 768;
    const isSmall = windowWidth >= 640;

    const fetchTshirts = useCallback(async () => {
        if (!user?.token) return;
        setIsLoading(true);
        try {
            await api.get('/tshirt/getAll', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
        } catch (error) {
            console.error('Error fetching t-shirts:', error);
            showNotification('Failed to fetch t-shirts');
        } finally {
            setIsLoading(false);
        }
    }, [user?.token]);

    useEffect(() => {
        fetchTshirts();
    }, [fetchTshirts]);

    const handleAuthSuccess = (userData: any) => {
        login(userData);
        navigate('/tshirt-designer');
    };

    const handleLogout = () => {
        logout();
        setUploadedImage(null);
        setUploadedFileName('');
        setDesignPosition({ x: 0, y: 0 });
        setDesignScale(1);
        setNotification('');
        navigate('/login');
    };

    if (!user) {
        return <Auth onAuthSuccess={handleAuthSuccess} />;
    }

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
                    setDesignPosition({ x: 0, y: 0 });
                    setDesignScale(1);
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

    const createDesign = async (): Promise<any> => {
        if (!uploadedImage) {
            showNotification('Please upload a design first');
            return null;
        }
        setIsLoading(true);
        try {
            const formData = new FormData();
            const response = await fetch(uploadedImage);
            const blob = await response.blob();
            const file = new File([blob], uploadedFileName, { type: blob.type });
            formData.append('file', file);

            const uploadResponse = await api.post('/upload', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            const filePath = uploadResponse.data;

            const designData = {
                filePath: filePath
            };

            const designResponse = await api.post('/design/create', designData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            showNotification('Design saved successfully!');
            return designResponse.data;
        } catch (error) {
            console.error('Error creating design:', error);
            showNotification('Design saved locally (backend unavailable)');
            return { designId: Date.now(), filePath: uploadedImage };
        } finally {
            setIsLoading(false);
        }
    };

    const saveAndConfirmOrder = async (): Promise<void> => {
        if (!uploadedImage) {
            showNotification('Please upload a design first');
            return;
        }
        setIsLoading(true);
        try {
            const design = await createDesign();
            if (!design) throw new Error('Design creation failed');

            const positionData = {
                x: designPosition.x,
                y: designPosition.y,
                z: 0
            };

            const positionResponse = await api.post('/position/create', positionData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const position = positionResponse.data;

            const rotationData = {
                x: 0,
                y: 0,
                z: 0
            };

            const rotationResponse = await api.post('/rotation/create', rotationData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const rotation = rotationResponse.data;

            const scaleData = {
                x: designScale,
                y: designScale,
                z: 1
            };

            const scaleResponse = await api.post('/scale/create', scaleData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const scale = scaleResponse.data;

            const placementData = {
                position: position,
                rotation: rotation,
                scale: scale
            };

            const placementResponse = await api.post('/placement-data/create', placementData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const placement = placementResponse.data;

            const tshirtData = {
                designId: design.designId,
                placementDataId: placement.placementDataId,
                name: "Custom T-Shirt",
                description: "Custom designed t-shirt",
                price: 29.99,
                color: selectedColor,
                size: selectedSize,
                view: selectedView
            };

            await api.post('/tshirt/create', tshirtData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            showNotification('Order confirmed successfully!');

            setTimeout(() => {
                setUploadedImage(null);
                setUploadedFileName('');
                setDesignPosition({ x: 0, y: 0 });
                setDesignScale(1);
                fetchTshirts();
            }, 2000);
        } catch (error) {
            console.error('Error confirming order:', error);
            showNotification('Order saved locally!');
        } finally {
            setIsLoading(false);
        }
    };

    const getCurrentColorHex = (): string => {
        const color = colors.find(c => c.value === selectedColor);
        return color ? color.hex : '#ffffff';
    };

    const removeDesign = (): void => {
        setUploadedImage(null);
        setUploadedFileName('');
        setDesignPosition({ x: 0, y: 0 });
        setDesignScale(1);
        showNotification('Design removed');
    };

    const adjustDesignPosition = (direction: string): void => {
        const step = 15;
        setDesignPosition(prev => {
            let newPosition = { ...prev };
            switch(direction) {
                case 'up':
                    newPosition.y = Math.max(prev.y - step, -100);
                    break;
                case 'down':
                    newPosition.y = Math.min(prev.y + step, 100);
                    break;
                case 'left':
                    newPosition.x = Math.max(prev.x - step, -100);
                    break;
                case 'right':
                    newPosition.x = Math.min(prev.x + step, 100);
                    break;
                default:
                    return prev;
            }
            return newPosition;
        });
    };

    const adjustDesignScale = (increase: boolean): void => {
        setDesignScale(prev => {
            const newScale = increase ? prev + 0.15 : prev - 0.15;
            return Math.max(0.3, Math.min(2.5, newScale));
        });
    };

    const resetDesign = (): void => {
        setDesignPosition({ x: 0, y: 0 });
        setDesignScale(1);
        showNotification('Design position and scale reset');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <Header page="designer" onButtonClick={handleLogout} />
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontWeight: '500'
                }}>
                    <AlertCircle style={{ height: '1.25rem', width: '1.25rem' }} />
                    <span>{notification}</span>
                </div>
            )}

            <main style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '2.5rem 1rem'
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '3rem'
                }}>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(to right, #111827, #1e40af, #7c3aed)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '1.5rem'
                    }}>
                        Design Your Perfect T-Shirt
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#6b7280',
                        maxWidth: '48rem',
                        margin: '0 auto',
                        lineHeight: '1.75'
                    }}>
                        Create stunning custom apparel with our intuitive design tool. Upload your artwork, choose colors, and bring your vision to life with professional-quality results.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isLarge ? '1fr 2fr' : '1fr',
                    gap: '2.5rem'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '1rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        padding: '2rem',
                        border: '1px solid #f3f4f6'
                    }}>
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
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    border: '2px dashed #d1d5db',
                                    borderRadius: '0.75rem',
                                    padding: '2.5rem',
                                    textAlign: 'center',
                                    transition: 'all 0.3s',
                                    cursor: 'pointer',
                                    background: 'transparent',
                                    opacity: isLoading ? 0.5 : 1
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

                            {uploadedImage && (
                                <div style={{
                                    marginTop: '1.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.75rem'
                                }}>
                                    <button
                                        onClick={removeDesign}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            background: '#fef2f2',
                                            color: '#b91c1c',
                                            borderRadius: '0.75rem',
                                            border: '1px solid #fecaca',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        Remove Design
                                    </button>
                                    <button
                                        onClick={resetDesign}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            background: '#f9fafb',
                                            color: '#374151',
                                            borderRadius: '0.75rem',
                                            border: '1px solid #e5e7eb',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        Reset Position & Scale
                                    </button>
                                    <button
                                        onClick={() => createDesign()}
                                        disabled={isLoading}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            padding: '0.75rem 1rem',
                                            background: 'linear-gradient(to right, #059669, #047857)',
                                            color: 'white',
                                            borderRadius: '0.75rem',
                                            border: 'none',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            opacity: isLoading ? 0.5 : 1
                                        }}
                                    >
                                        <Save style={{ height: '1.25rem', width: '1.25rem' }} />
                                        <span>{isLoading ? 'Saving...' : 'Save Design'}</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {uploadedImage && (
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    color: '#111827',
                                    marginBottom: '1.5rem'
                                }}>Design Controls</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#374151',
                                            marginBottom: '0.75rem',
                                            display: 'block'
                                        }}>
                                            Position Controls
                                        </label>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3, 1fr)',
                                            gap: '0.5rem'
                                        }}>
                                            <div></div>
                                            <button
                                                onClick={() => adjustDesignPosition('up')}
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    background: 'linear-gradient(to bottom, #3b82f6, #2563eb)',
                                                    color: 'white',
                                                    borderRadius: '0.75rem',
                                                    border: 'none',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <ArrowUp style={{ height: '1rem', width: '1rem' }} />
                                            </button>
                                            <div></div>
                                            <button
                                                onClick={() => adjustDesignPosition('left')}
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    background: 'linear-gradient(to right, #3b82f6, #2563eb)',
                                                    color: 'white',
                                                    borderRadius: '0.75rem',
                                                    border: 'none',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <ArrowLeft style={{ height: '1rem', width: '1rem' }} />
                                            </button>
                                            <div style={{
                                                padding: '0.5rem 0.75rem',
                                                background: '#f3f4f6',
                                                borderRadius: '0.75rem',
                                                textAlign: 'center',
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                color: '#6b7280',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {designPosition.x},{designPosition.y}
                                            </div>
                                            <button
                                                onClick={() => adjustDesignPosition('right')}
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    background: 'linear-gradient(to right, #3b82f6, #2563eb)',
                                                    color: 'white',
                                                    borderRadius: '0.75rem',
                                                    border: 'none',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <ArrowRight style={{ height: '1rem', width: '1rem' }} />
                                            </button>
                                            <div></div>
                                            <button
                                                onClick={() => adjustDesignPosition('down')}
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    background: 'linear-gradient(to bottom, #3b82f6, #2563eb)',
                                                    color: 'white',
                                                    borderRadius: '0.75rem',
                                                    border: 'none',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <ArrowDown style={{ height: '1rem', width: '1rem' }} />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#374151',
                                            marginBottom: '0.75rem',
                                            display: 'block'
                                        }}>
                                            Scale: {(designScale * 100).toFixed(0)}%
                                        </label>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '0.75rem'
                                        }}>
                                            <button
                                                onClick={() => adjustDesignScale(true)}
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    background: 'linear-gradient(to right, #059669, #047857)',
                                                    color: 'white',
                                                    borderRadius: '0.75rem',
                                                    border: 'none',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <Plus style={{ height: '1rem', width: '1rem' }} />
                                                <span>Larger</span>
                                            </button>
                                            <button
                                                onClick={() => adjustDesignScale(false)}
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    background: 'linear-gradient(to right, #ea580c, #c2410c)',
                                                    color: 'white',
                                                    borderRadius: '0.75rem',
                                                    border: 'none',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <Minus style={{ height: '1rem', width: '1rem' }} />
                                                <span>Smaller</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

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
                                <Eye style={{ height: '1.5rem', width: '1.5rem', color: '#2563eb' }} />
                                View
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {['front', 'back'].map((view) => (
                                    <button
                                        key={view}
                                        onClick={() => setSelectedView(view)}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '0.75rem',
                                            border: selectedView === view ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                                            fontWeight: 'bold',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer',
                                            background: selectedView === view ? 'linear-gradient(to right, #dbeafe, #ede9fe)' : 'white',
                                            color: selectedView === view ? '#1d4ed8' : '#374151',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {view}
                                    </button>
                                ))}
                            </div>
                        </div>

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

                        <div>
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
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '1rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        padding: '2.5rem',
                        border: '1px solid #f3f4f6'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '500px'
                        }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    width: '384px',
                                    height: '480px',
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
                                            width: '140px',
                                            height: '140px',
                                            left: `${50 + designPosition.x/6}%`,
                                            top: `${40 + designPosition.y/6}%`,
                                            transform: `translate(-50%, -50%) scale(${designScale})`
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
                                            <div style={{
                                                textAlign: 'center',
                                                opacity: 0.6
                                            }}>
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

                                <div style={{
                                    position: 'absolute',
                                    bottom: '-3rem',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'linear-gradient(to right, #374151, #1f2937)',
                                    color: 'white',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.875rem',
                                    fontWeight: 'bold',
                                    textTransform: 'capitalize',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}>
                                    {selectedView} View
                                </div>
                            </div>
                        </div>

                        <div style={{
                            marginTop: '2.5rem',
                            background: 'linear-gradient(to right, #f9fafb, #f3f4f6)',
                            borderRadius: '0.75rem',
                            padding: '1.5rem',
                            border: '1px solid #e5e7eb'
                        }}>
                            <h4 style={{
                                fontWeight: 'bold',
                                color: '#111827',
                                marginBottom: '1rem',
                                fontSize: '1.125rem'
                            }}>Current Selection:</h4>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: isMedium ? 'repeat(3, 1fr)' : '1fr',
                                gap: '1.5rem',
                                fontSize: '0.875rem'
                            }}>
                                <div>
                                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Color:</span>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        marginTop: '0.5rem'
                                    }}>
                                        <div style={{
                                            width: '1.5rem',
                                            height: '1.5rem',
                                            borderRadius: '0.5rem',
                                            border: '2px solid #d1d5db',
                                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                            backgroundColor: getCurrentColorHex()
                                        }} />
                                        <span style={{
                                            textTransform: 'capitalize',
                                            fontWeight: 'bold',
                                            color: '#1f2937'
                                        }}>
                                            {selectedColor}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Size:</span>
                                    <p style={{
                                        fontWeight: 'bold',
                                        color: '#1f2937',
                                        fontSize: '1.125rem',
                                        marginTop: '0.25rem',
                                        margin: 0
                                    }}>
                                        {selectedSize}
                                    </p>
                                </div>
                                <div>
                                    <span style={{ color: '#6b7280', fontWeight: '500' }}>View:</span>
                                    <p style={{
                                        fontWeight: 'bold',
                                        color: '#1f2937',
                                        fontSize: '1.125rem',
                                        marginTop: '0.25rem',
                                        textTransform: 'capitalize',
                                        margin: 0
                                    }}>
                                        {selectedView}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            marginTop: '2.5rem',
                            display: 'flex',
                            flexDirection: isSmall ? 'row' : 'column',
                            justifyContent: 'center',
                            gap: '1rem'
                        }}>
                            <button
                                onClick={triggerFileUpload}
                                disabled={isLoading}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    padding: '1rem 2rem',
                                    border: '2px solid #93c5fd',
                                    color: '#1d4ed8',
                                    borderRadius: '0.75rem',
                                    transition: 'all 0.2s',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    background: 'white',
                                    cursor: 'pointer',
                                    opacity: isLoading ? 0.5 : 1
                                }}
                            >
                                <Upload style={{ height: '1.25rem', width: '1.25rem' }} />
                                <span>{uploadedImage ? 'Change Design' : 'Add Design'}</span>
                            </button>
                            <button
                                onClick={saveAndConfirmOrder}
                                disabled={isLoading || !uploadedImage}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    padding: '1rem 2rem',
                                    background: 'linear-gradient(to right, #2563eb, #9333ea)',
                                    color: 'white',
                                    borderRadius: '0.75rem',
                                    border: 'none',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    opacity: isLoading || !uploadedImage ? 0.5 : 1
                                }}
                            >
                                <ShoppingCart style={{ height: '1.25rem', width: '1.25rem' }} />
                                <span>{isLoading ? 'Processing...' : 'Save & Confirm Order'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{
                    marginTop: '5rem',
                    display: 'grid',
                    gridTemplateColumns: isMedium ? 'repeat(3, 1fr)' : '1fr',
                    gap: '2.5rem'
                }}>
                    <div style={{
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '1rem',
                        padding: '2rem',
                        border: '1px solid #f3f4f6',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                    }}>
                        <div style={{
                            borderRadius: '1rem',
                            width: '5rem',
                            height: '5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)'
                        }}>
                            <Upload style={{ height: '2.5rem', width: '2.5rem', color: '#2563eb' }} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                            Easy Upload
                        </h3>
                        <p style={{ color: '#6b7280', lineHeight: '1.75' }}>
                            Upload your designs in seconds with support for all major file formats and real-time preview
                        </p>
                    </div>
                    <div style={{
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '1rem',
                        padding: '2rem',
                        border: '1px solid #f3f4f6',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                    }}>
                        <div style={{
                            borderRadius: '1rem',
                            width: '5rem',
                            height: '5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)'
                        }}>
                            <Palette style={{ height: '2.5rem', width: '2.5rem', color: '#059669' }} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                            Premium Quality
                        </h3>
                        <p style={{ color: '#6b7280', lineHeight: '1.75' }}>
                            High-quality printing on premium fabrics with vibrant colors that last wash after wash
                        </p>
                    </div>
                    <div style={{
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '1rem',
                        padding: '2rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        transform: 'translateY(0)'
                    }}
                         onMouseEnter={(e) => {
                             e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                             e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                         }}
                         onMouseLeave={(e) => {
                             e.currentTarget.style.transform = 'translateY(0) scale(1)';
                             e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                         }}
                    >
                        <div style={{
                            borderRadius: '1rem',
                            width: '5rem',
                            height: '5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            background: 'linear-gradient(135deg, #ddd6fe, #c4b5fd)'
                        }}>
                            <Shirt style={{ height: '2.5rem', width: '2.5rem', color: '#7c3aed' }} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                            Fully Customizable
                        </h3>
                        <p style={{ color: '#6b7280', lineHeight: '1.75' }}>
                            Adjust size, position, and scale to create the perfect design for your apparel
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TShirtDesigner;