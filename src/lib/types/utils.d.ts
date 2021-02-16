import { ChangeEvent } from "react";

export type NumberFormat = 'LATIN' | 'FARSI';

interface DateTimeEventType extends ChangeEvent<HTMLInputElement> {
  target: EventTarget & HTMLInputElement & { formatted: string, date: Date | null }
}