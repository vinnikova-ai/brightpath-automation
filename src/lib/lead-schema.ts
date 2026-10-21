import { z } from "zod";

export const leadContactSchema = z.object({
  name: z.string().trim().min(1, "Введите имя").max(100, "Слишком длинное имя"),
  contact: z.string().trim().min(3, "Укажите Telegram или Email").max(255, "Слишком длинный контакт")
    .refine((v) => /^@?[a-zA-Z0-9_]{4,32}$/.test(v) || z.string().email().safeParse(v).success, "Неверный формат Telegram или Email"),
});
