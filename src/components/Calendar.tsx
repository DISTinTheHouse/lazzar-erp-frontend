"use client";

import FullCalendar from "@fullcalendar/react";
import type { CalendarOptions } from "@fullcalendar/core";

type CalendarProps = CalendarOptions;

export default function Calendar(props: CalendarProps) {
  return <FullCalendar {...props} />;
}
