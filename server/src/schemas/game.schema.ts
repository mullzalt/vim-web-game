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
  intended_keystrokes: number(),
  hints: optional(string()),
}).or(
  object({
    action: literal("modify"),
    after: string(),
    intended_keystrokes: number(),
    hints: optional(string()),
  }),
);

export const createGameSchema = object({
  body: object({
    title: string().default("New Module"),
    desc: string().default("enter desc"),
    initial_code: string().default("enter initial code"),
    short_desc: string().default("enter short desc"),
    actions: array(actionSchema).default([]),
    intended_keystrokes: number().default(0),
    lang: optional(string()),
    archived: optional(boolean()),
  }),
});

export type GameInput = TypeOf<typeof createGameSchema>["body"];
