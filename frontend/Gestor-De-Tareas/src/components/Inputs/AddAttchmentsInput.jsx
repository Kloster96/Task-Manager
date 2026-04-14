import React, { useState } from 'react'
import { HiOutlineTrash } from 'react-icons/hi2'
import { LuPaperclip, LuUpload, LuFile, LuX } from 'react-icons/lu'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'

const AddAttchmentsInput = ({ attachments, setAttachments }) => {
    const [uploading, setUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    const handleFileUpload = async (files) => {
        if (!files || files.length === 0) return

        setUploading(true)
        
        try {
            const formData = new FormData()
            for (let i = 0; i < files.length; i++) {
                formData.append('file', files[i])
            }

            const response = await axiosInstance.post(
                API_PATHS.IMAGE.UPLOAD_ATTACHMENT,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            )

            if (response.data?.attachments) {
                const newAttachments = response.data.attachments.map(a => a.url)
                setAttachments([...attachments, ...newAttachments])
                toast.success(`${files.length} archivo(s) subido(s)`)
            }
        } catch (error) {
            console.error('Error uploading file:', error)
            toast.error('Error al subir archivo')
        } finally {
            setUploading(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setDragActive(true)
    }

    const handleDragLeave = () => {
        setDragActive(false)
    }

    const handleDelete = (index) => {
        const updatedArr = attachments.filter((_, idx) => idx !== index)
        setAttachments(updatedArr)
    }

    const getFileName = (url) => {
        try {
            const parts = url.split('/')
            return parts[parts.length - 1] || url
        } catch {
            return url
        }
    }

    return (
        <div>
            {/* Lista de archivos */}
            {attachments.map((item, index) => (
                <div
                    className="flex justify-between items-center bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg mb-2"
                    key={index}
                >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <LuFile className="text-slate-400 flex-shrink-0" />
                        <a 
                            href={item} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-slate-700 dark:text-slate-300 truncate hover:text-primary"
                        >
                            {getFileName(item)}
                        </a>
                    </div>
                    <button 
                        className="cursor-pointer p-1 hover:bg-slate-200 rounded flex-shrink-0"
                        onClick={() => handleDelete(index)}
                    >
                        <HiOutlineTrash className="text-lg text-red-500" />
                    </button>
                </div>
            ))}

            {/* Área de drop y upload */}
            <div 
                className={`
                    mt-4 border-2 border-dashed rounded-xl p-6 text-center
                    transition-colors cursor-pointer
                    ${dragActive 
                        ? 'border-primary bg-primary/5' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }
                    ${uploading ? 'opacity-50 cursor-wait' : ''}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById('file-upload').click()}
            >
                <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    disabled={uploading}
                />
                
                {uploading ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-slate-500">Subiendo...</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <LuUpload className="text-2xl text-slate-400" />
                        <span className="text-sm text-slate-500">
                            Arrastrá archivos o click para subir
                        </span>
                        <span className="text-xs text-slate-400">
                            PDF, imágenes, documentos (máx 5MB)
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddAttchmentsInput