import type { z } from "zod";
import type {
  createTrackerSchema,
  updateTrackerSchema,
} from "../validations/tracker-schema";

export type CreateTrackerRequest = z.infer<typeof createTrackerSchema>;
export type UpdateTrackerRequest = z.infer<typeof updateTrackerSchema>;
