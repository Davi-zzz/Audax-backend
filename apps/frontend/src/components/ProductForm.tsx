import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, AlertCircle, CheckCircle2, RefreshCw, PlusCircle, Save, XCircle } from 'lucide-react';
import { Product, ProductFormData, ValidationErrors, ValidationSuccess } from '../types';
import { IMAGE_PRESETS } from '../initialData';

interface ProductFormProps {
  onSubmit: (formData: ProductFormData) => void;
  editingProduct: Product | null;
  onCancelEdit: () => void;
  products: Product[];
}

export default function ProductForm({ onSubmit, editingProduct, onCancelEdit, products }: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Base form state
  const [formData, setFormData] = useState<ProductFormData>({
    sku: '',
    name: '',
    description: '',
    stock: '',
    image: IMAGE_PRESETS[0].svgUrl, // Default to first preset
  });

  // Validation States
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [success, setSuccess] = useState<ValidationSuccess>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset form when entering/leaving edit mode
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        sku: editingProduct.sku,
        name: editingProduct.name,
        description: editingProduct.description,
        stock: editingProduct.stock.toString(),
        image: editingProduct.image,
      });
      // Clear errors on load of existing valid product
      setErrors({});
      setSuccess({ sku: true, name: true, description: true, stock: true });
      setTouched({ sku: true, name: true, description: true, stock: true });
    } else {
      resetForm();
    }
  }, [editingProduct]);

  // Real-time validation runner
  const validateField = (name: string, value: string) => {
    const newErrors: ValidationErrors = { ...errors };
    const newSuccess: ValidationSuccess = { ...success };

    switch (name) {
      case 'sku': {
        const trimmed = value.trim().toUpperCase();
        if (!trimmed) {
          newErrors.sku = 'O SKU é obrigatório.';
          delete newSuccess.sku;
        } else if (trimmed.length < 3) {
          newErrors.sku = 'O SKU deve ter pelo menos 3 caracteres.';
          delete newSuccess.sku;
        } else if (!/^[A-Z0-9-]+$/.test(trimmed)) {
          newErrors.sku = 'Apenas letras maiúsculas, números e hifens.';
          delete newSuccess.sku;
        } else {
          // Check for SKU uniqueness
          const isDuplicate = products.some(p => p.sku.toUpperCase() === trimmed && (!editingProduct || p.id !== editingProduct.id));
          if (isDuplicate) {
            newErrors.sku = 'Este SKU já está cadastrado em outro produto.';
            delete newSuccess.sku;
          } else {
            delete newErrors.sku;
            newSuccess.sku = true;
          }
        }
        break;
      }
      case 'name': {
        const trimmed = value.trim();
        if (!trimmed) {
          newErrors.name = 'O nome do produto é obrigatório.';
          delete newSuccess.name;
        } else if (trimmed.length < 3) {
          newErrors.name = 'O nome deve conter pelo menos 3 caracteres.';
          delete newSuccess.name;
        } else if (trimmed.length > 50) {
          newErrors.name = 'O nome deve conter no máximo 50 caracteres.';
          delete newSuccess.name;
        } else {
          delete newErrors.name;
          newSuccess.name = true;
        }
        break;
      }
      case 'description': {
        const trimmed = value.trim();
        if (!trimmed) {
          newErrors.description = 'A descrição do produto é obrigatória.';
          delete newSuccess.description;
        } else if (trimmed.length < 10) {
          newErrors.description = 'Descreva melhor! Use pelo menos 10 caracteres.';
          delete newSuccess.description;
        } else if (trimmed.length > 200) {
          newErrors.description = 'A descrição não pode passar de 200 caracteres.';
          delete newSuccess.description;
        } else {
          delete newErrors.description;
          newSuccess.description = true;
        }
        break;
      }
      case 'stock': {
        const trimmed = value.trim();
        if (trimmed === '') {
          newErrors.stock = 'A quantidade em estoque é obrigatória.';
          delete newSuccess.stock;
        } else if (!/^\d+$/.test(trimmed)) {
          newErrors.stock = 'O estoque deve ser um número inteiro não-negativo.';
          delete newSuccess.stock;
        } else {
          const num = parseInt(trimmed, 10);
          if (isNaN(num) || num < 0) {
            newErrors.stock = 'O estoque deve ser maior ou igual a zero.';
            delete newSuccess.stock;
          } else {
            delete newErrors.stock;
            newSuccess.stock = true;
          }
        }
        break;
      }
    }

    setErrors(newErrors);
    setSuccess(newSuccess);
  };

  // Run validation on all fields for dynamic submit blocking
  const runAllValidations = (dataToValidate: ProductFormData) => {
    const currentErrors: ValidationErrors = {};
    const currentSuccess: ValidationSuccess = {};

    // SKU
    const skuTrimmed = dataToValidate.sku.trim().toUpperCase();
    if (!skuTrimmed) currentErrors.sku = 'O SKU é obrigatório.';
    else if (skuTrimmed.length < 3) currentErrors.sku = 'O SKU deve ter pelo menos 3 caracteres.';
    else if (!/^[A-Z0-9-]+$/.test(skuTrimmed)) currentErrors.sku = 'Apenas letras, números e hifens.';
    else if (products.some(p => p.sku.toUpperCase() === skuTrimmed && (!editingProduct || p.id !== editingProduct.id))) {
      currentErrors.sku = 'Este SKU já está cadastrado em outro produto.';
    } else currentSuccess.sku = true;

    // Name
    const nameTrimmed = dataToValidate.name.trim();
    if (!nameTrimmed) currentErrors.name = 'O nome é obrigatório.';
    else if (nameTrimmed.length < 3) currentErrors.name = 'O nome deve ter pelo menos 3 caracteres.';
    else if (nameTrimmed.length > 50) currentErrors.name = 'O nome deve ter no máximo 50 caracteres.';
    else currentSuccess.name = true;

    // Description
    const descTrimmed = dataToValidate.description.trim();
    if (!descTrimmed) currentErrors.description = 'A descrição é obrigatória.';
    else if (descTrimmed.length < 10) currentErrors.description = 'Use pelo menos 10 caracteres.';
    else if (descTrimmed.length > 200) currentErrors.description = 'No máximo 200 caracteres.';
    else currentSuccess.description = true;

    // Stock
    const stockTrimmed = dataToValidate.stock.trim();
    if (stockTrimmed === '') currentErrors.stock = 'O estoque é obrigatório.';
    else if (!/^\d+$/.test(stockTrimmed)) currentErrors.stock = 'O estoque deve ser um número inteiro.';
    else {
      const num = parseInt(stockTrimmed, 10);
      if (isNaN(num) || num < 0) currentErrors.stock = 'Deve ser maior ou igual a zero.';
      else currentSuccess.stock = true;
    }

    return { currentErrors, currentSuccess };
  };

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const formattedValue = name === 'sku' ? value.toUpperCase() : value;
    
    const updatedForm = { ...formData, [name]: formattedValue };
    setFormData(updatedForm);
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formattedValue);
  };

  // Handle Input Blur for touching validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  // Handle Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem é muito grande! Escolha um arquivo de no máximo 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setFormData(prev => ({ ...prev, image: uploadEvent.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Pick Preset Image
  const pickPreset = (presetSvg: string) => {
    setFormData(prev => ({ ...prev, image: presetSvg }));
  };

  // Reset form helper
  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      description: '',
      stock: '',
      image: IMAGE_PRESETS[0].svgUrl,
    });
    setErrors({});
    setSuccess({});
    setTouched({});
  };

  // Handle Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all as touched
    const allTouched = { sku: true, name: true, description: true, stock: true };
    setTouched(allTouched);

    const { currentErrors, currentSuccess } = runAllValidations(formData);
    setErrors(currentErrors);
    setSuccess(currentSuccess);

    const isValid = Object.keys(currentErrors).length === 0;

    if (isValid) {
      onSubmit(formData);
      resetForm();
    }
  };

  // Compute disabled button state
  const { currentErrors } = runAllValidations(formData);
  const isFormInvalid = Object.keys(currentErrors).length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6" id="product-form-container">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-sans font-semibold text-lg text-slate-900 flex items-center gap-2">
          {editingProduct ? (
            <>
              <Save className="w-5 h-5 text-indigo-600" />
              <span>Editar Produto</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              <span>Novo Produto</span>
            </>
          )}
        </h2>
        {editingProduct && (
          <button
            onClick={onCancelEdit}
            className="text-xs text-rose-500 hover:text-rose-600 border border-rose-200 hover:border-rose-300 bg-rose-50 px-2.5 py-1 rounded-md transition duration-200 flex items-center gap-1 cursor-pointer"
            id="cancel-edit-btn"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelar Edição</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" id="product-form">
        {/* SKU Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>SKU do Produto</span>
            {touched.sku && (
              errors.sku ? (
                <span className="text-[10px] font-medium text-rose-500 flex items-center gap-0.5 normal-case tracking-normal">
                  <AlertCircle className="w-3 h-3" />
                  Incompleto
                </span>
              ) : success.sku ? (
                <span className="text-[10px] font-medium text-emerald-500 flex items-center gap-0.5 normal-case tracking-normal">
                  <CheckCircle2 className="w-3 h-3" />
                  Disponível
                </span>
              ) : null
            )}
          </label>
          <div className="relative">
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ex: TEC-MECH-01"
              maxLength={20}
              className={`w-full px-3 py-2 text-sm bg-slate-50/60 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 ${
                touched.sku && errors.sku
                  ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100/50 text-rose-900 bg-rose-50/20'
                  : touched.sku && success.sku
                  ? 'border-emerald-200 focus:border-emerald-400 focus:ring-emerald-100/50 bg-emerald-50/5'
                  : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100/50 text-slate-800'
              }`}
              id="sku-input"
            />
          </div>
          {touched.sku && errors.sku && (
            <p className="mt-1 text-xs text-rose-500 font-medium flex items-start gap-1" id="sku-error">
              <span>{errors.sku}</span>
            </p>
          )}
          <p className="mt-1 text-[11px] text-slate-400">Padrão alfanumérico e hifens (Ex: TEC-RGB, PROD-102).</p>
        </div>

        {/* Nome Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Nome</span>
            {touched.name && (
              errors.name ? (
                <span className="text-[10px] font-medium text-rose-500 flex items-center gap-0.5 normal-case tracking-normal">
                  <AlertCircle className="w-3 h-3" />
                  Incorreto
                </span>
              ) : success.name ? (
                <span className="text-[10px] font-medium text-emerald-500 flex items-center gap-0.5 normal-case tracking-normal">
                  <CheckCircle2 className="w-3 h-3" />
                  Válido
                </span>
              ) : null
            )}
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex: Teclado Mecânico RGB"
            maxLength={50}
            className={`w-full px-3 py-2 text-sm bg-slate-50/60 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 ${
              touched.name && errors.name
                ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100/50 text-rose-900 bg-rose-50/20'
                : touched.name && success.name
                ? 'border-emerald-200 focus:border-emerald-400 focus:ring-emerald-100/50 bg-emerald-50/5'
                : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100/50 text-slate-800'
            }`}
            id="name-input"
          />
          {touched.name && errors.name && (
            <p className="mt-1 text-xs text-rose-500 font-medium" id="name-error">{errors.name}</p>
          )}
        </div>

        {/* Descrição Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Descrição Completa</span>
            {touched.description && (
              errors.description ? (
                <span className="text-[10px] font-medium text-rose-500 flex items-center gap-0.5 normal-case tracking-normal">
                  <AlertCircle className="w-3 h-3" />
                  Incorreto
                </span>
              ) : success.description ? (
                <span className="text-[10px] font-medium text-emerald-500 flex items-center gap-0.5 normal-case tracking-normal">
                  <CheckCircle2 className="w-3 h-3" />
                  Excelente
                </span>
              ) : null
            )}
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex: Teclado gamer com switch azul táctil silencioso e retroiluminação personalizável..."
            maxLength={200}
            className={`w-full px-3 py-2 text-sm bg-slate-50/60 rounded-xl border transition-all duration-200 resize-none focus:outline-hidden focus:ring-2 ${
              touched.description && errors.description
                ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100/50 text-rose-900 bg-rose-50/20'
                : touched.description && success.description
                ? 'border-emerald-200 focus:border-emerald-400 focus:ring-emerald-100/50 bg-emerald-50/5'
                : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100/50 text-slate-800'
            }`}
            id="description-input"
          />
          <div className="flex items-center justify-between mt-1">
            {touched.description && errors.description ? (
              <span className="text-xs text-rose-500 font-medium" id="description-error">{errors.description}</span>
            ) : (
              <span />
            )}
            <span className="text-[10px] text-slate-400 ml-auto font-mono">
              {formData.description.length}/200 caracteres
            </span>
          </div>
        </div>

        {/* Estoque Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Estoque Inicial</span>
            {touched.stock && (
              errors.stock ? (
                <span className="text-[10px] font-medium text-rose-500 flex items-center gap-0.5 normal-case tracking-normal">
                  <AlertCircle className="w-3 h-3" />
                  Inválido
                </span>
              ) : success.stock ? (
                <span className="text-[10px] font-medium text-emerald-500 flex items-center gap-0.5 normal-case tracking-normal">
                  <CheckCircle2 className="w-3 h-3" />
                  Pronto
                </span>
              ) : null
            )}
          </label>
          <input
            type="text"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Quantidade (Ex: 150)"
            className={`w-full px-3 py-2 text-sm bg-slate-50/60 rounded-xl border transition-all duration-200 focus:outline-hidden focus:ring-2 ${
              touched.stock && errors.stock
                ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100/50 text-rose-900 bg-rose-50/20'
                : touched.stock && success.stock
                ? 'border-emerald-200 focus:border-emerald-400 focus:ring-emerald-100/50 bg-emerald-50/5'
                : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100/50 text-slate-800'
            }`}
            id="stock-input"
          />
          {touched.stock && errors.stock && (
            <p className="mt-1 text-xs text-rose-500 font-medium" id="stock-error">{errors.stock}</p>
          )}
        </div>

        {/* Imagem do Item */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Imagem do Item
          </label>
          
          <div className="grid grid-cols-5 gap-3 items-center mb-3">
            {/* Preview Box */}
            <div className="col-span-2 aspect-square rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden relative group">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Prévia do produto"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  id="image-preview"
                />
              ) : (
                <div className="text-center p-2 text-slate-400">
                  <ImageIcon className="w-6 h-6 mx-auto stroke-1" />
                  <span className="text-[10px]">Sem Imagem</span>
                </div>
              )}
            </div>

            {/* Upload Action */}
            <div className="col-span-3 space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
                id="file-upload-input"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="w-full py-2 px-3 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
                id="upload-image-trigger"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                Upload de Imagem
              </button>
              <p className="text-[10px] text-slate-400 text-center">Formatos PNG/JPG até 2MB.</p>
            </div>
          </div>

          {/* Quick SVG Presets */}
          <div>
            <p className="text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Presets de Ilustrações Vetoriais:</p>
            <div className="grid grid-cols-4 gap-2">
              {IMAGE_PRESETS.map((preset) => {
                const isSelected = formData.image === preset.svgUrl;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => pickPreset(preset.svgUrl)}
                    title={preset.name}
                    className={`aspect-square rounded-lg border-2 overflow-hidden transition-all duration-200 cursor-pointer relative ${
                      isSelected ? 'border-indigo-600 ring-2 ring-indigo-100 scale-95' : 'border-transparent hover:border-slate-300'
                    }`}
                    id={`preset-btn-${preset.id}`}
                  >
                    <img
                      src={preset.svgUrl}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isFormInvalid}
            className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
              isFormInvalid
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-75'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 hover:shadow-lg active:scale-98'
            }`}
            id="submit-product-btn"
          >
            {editingProduct ? (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Atualizar Produto</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Cadastrar Produto</span>
              </>
            )}
          </button>
          {isFormInvalid && (
            <p className="mt-2 text-center text-[11px] text-rose-500 font-medium">
              Por favor, preencha corretamente todos os campos com erro.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
