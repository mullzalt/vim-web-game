import {
  object,
  string,
  number,
  literal,
  array,
  optional,
  TypeOf,
  boolean,
} from "zod";

const actionSchema = object({
  action: literal("select"),
  selection: object({
    anchor: number(),
    head: number(),
  }),
  intendedKeystrokes: number(),
  hints: optional(string()),
}).or(
  object({
    action: literal("modify"),
    after: string(),
    intendedKeystrokes: number(),
    hints: optional(string()),
  }),
);

export const createGameSchema = object({
  body: object({
    title: string().default("New Module"),
    desc: string().default("enter desc"),
    initialCode: string().default("enter initial code"),
    shortDesc: string().default("enter short desc"),
    actions: array(actionSchema).default([]),
    intendedKeystrokes: number().default(0),
    lang: optional(string().nullable()),
    archived: optional(boolean()),
  }),
});

export type GameInput = TypeOf<typeof createGameSchema>["body"];
