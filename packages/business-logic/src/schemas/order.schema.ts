import { z } from "zod";
import { ORDER_STATUS } from "@food-rescue/config";

export const orderSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  item_id: z.string().uuid(),
  status: z.enum([
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.READY,
    ORDER_STATUS.COMPLETED,
    ORDER_STATUS.CANCELLED,
  ]).default(ORDER_STATUS.PENDING),
  qr_code_hash: z.string().min(1),
  quantity: z.number().int().positive("Quantity must be positive"),
  total_price: z.number().positive("Total price must be positive"),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const createOrderSchema = orderSchema.omit({
  id: true,
  status: true,
  qr_code_hash: true,
  created_at: true,
  updated_at: true,
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.READY,
    ORDER_STATUS.COMPLETED,
    ORDER_STATUS.CANCELLED,
  ]),
});

export type Order = z.infer<typeof orderSchema>;
export type CreateOrder = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatus = z.infer<typeof updateOrderStatusSchema>;
