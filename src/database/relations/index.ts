import { relations } from "drizzle-orm";
import {
  insurances,
  serviceCategories,
  tolls,
  vehicles,
} from "../schema/garage";
import { serviceLogs } from "../schema/vehicles";
import { checklistItems, checklistPacks } from "../schema/tasks";

export const vehiclesRelations = relations(vehicles, ({ many }) => ({
  services: many(serviceLogs),
  insurances: many(insurances),
  tolls: many(tolls),
}));

export const serviceLogsRelations = relations(serviceLogs, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [serviceLogs.vehicleId],
    references: [vehicles.id],
  }),
  category: one(serviceCategories, {
    fields: [serviceLogs.categoryId],
    references: [serviceCategories.id],
  }),
}));

export const insurancesRelations = relations(insurances, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [insurances.vehicleId],
    references: [vehicles.id],
  }),
}));

export const tollsRelations = relations(tolls, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [tolls.vehicleId],
    references: [vehicles.id],
  }),
}));

export const checklistPacksRelations = relations(
  checklistPacks,
  ({ many }) => ({
    items: many(checklistItems),
  }),
);

export const checklistItemsRelations = relations(checklistItems, ({ one }) => ({
  pack: one(checklistPacks, {
    fields: [checklistItems.packId],
    references: [checklistPacks.id],
  }),
}));
