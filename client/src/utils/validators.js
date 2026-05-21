import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.').max(120),
    email: z.string().email('Email inválido.').toLowerCase(),
    phone: z
      .string()
      .regex(/^(\+52)?[0-9]{10}$/, 'Teléfono inválido. Ingresa 10 dígitos.')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula.')
      .regex(/[0-9]/, 'Debe contener al menos un número.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Email inválido.'),
  password: z.string().min(1, 'La contraseña es requerida.'),
});

export const bookingSchema = z.object({
  service_id: z.string().uuid('Selecciona un servicio.'),
  stylist_id: z.string().uuid('Selecciona una estilista.'),
  appointment_date: z
    .string()
    .min(1, 'Selecciona una fecha.')
    .refine((val) => new Date(val) >= new Date(new Date().setHours(0,0,0,0)), {
      message: 'La fecha no puede ser en el pasado.',
    }),
  appointment_time: z.string().min(1, 'Selecciona una hora.'),
  notes: z.string().max(500, 'Máximo 500 caracteres.').optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Nombre requerido (mín. 2 caracteres).').max(150),
  description: z.string().max(500).optional(),
  category: z.string().max(80).optional(),
  price: z.number({ invalid_type_error: 'Precio inválido.' }).positive('El precio debe ser mayor a 0.'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo.'),
  low_stock_threshold: z.number().int().min(1).optional(),
  brand: z.string().max(80).optional(),
  sku: z.string().max(60).optional(),
});

export const stockUpdateSchema = z.object({
  change_amount: z
    .number({ invalid_type_error: 'Ingresa un número.' })
    .int('Debe ser un número entero.')
    .refine((v) => v !== 0, 'El cambio no puede ser cero.'),
  reason: z.string().max(200).optional(),
});
