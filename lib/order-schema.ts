import { z } from "zod";

export const orderSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[+0-9][0-9\s-]{6,18}$/),
  email: z.string().trim().email().max(254),
  location: z.string().trim().min(5).max(500),
  deliveryArea: z.enum(["inside-kathmandu", "outside-kathmandu"]),
  productSlug: z.string().trim().min(1),
  productName: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(10),
  pricePerPiece: z.number().positive(),
  deliveryFee: z.number().nonnegative(),
  totalPrice: z.number().positive(),
  clientRequestId: z.string().uuid(),
});

export type OrderInput = z.infer<typeof orderSchema>;
