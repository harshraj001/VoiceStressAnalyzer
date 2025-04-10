import { pgTable, text, serial, integer, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const stressAnalyses = pgTable("stress_analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  stressLevel: integer("stress_level").notNull(), // 0-100 scale
  voiceToneScore: integer("voice_tone_score").notNull(), // 0-100 scale
  speechPaceScore: integer("speech_pace_score").notNull(), // 0-100 scale
  voiceTremorScore: integer("voice_tremor_score").notNull(), // 0-100 scale
  sentimentScore: integer("sentiment_score").notNull(), // 0-100 scale
  transcript: text("transcript"),
  audioFeatures: text("audio_features"), // JSON string of extracted audio features
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  isUserMessage: integer("is_user_message").notNull(), // 0 for bot, 1 for user
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertStressAnalysisSchema = createInsertSchema(stressAnalyses).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertStressAnalysis = z.infer<typeof insertStressAnalysisSchema>;
export type StressAnalysis = typeof stressAnalyses.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
