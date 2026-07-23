import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, doublePrecision, jsonb } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  phone: text('phone'),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Bookings / Catering Orders table
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // Firebase UID or user reference
  vendorId: text('vendor_id').notNull(),
  vendorName: text('vendor_name').notNull(),
  eventDate: text('event_date'),
  eventTime: text('event_time'),
  guestCount: integer('guest_count'),
  status: text('status').default('confirmed'),
  totalAmount: doublePrecision('total_amount').notNull(),
  items: jsonb('items'),
  calendarEventId: text('calendar_event_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Contacts sync cache
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));
