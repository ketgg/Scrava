"use client"

import React from "react"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

import TaskMenuButton from "./task-menu-btn"

import { TaskType } from "@/types/task"

type Props = {}

const TaskMenu = (props: Props) => {
  return (
    <aside className="w-64 min-w-64 max-w-64 h-full border-r border-separate p-2 px-4 overflow-auto">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["extraction", "interactions", "timing"]}
      >
        <AccordionItem value="extraction">
          <AccordionTrigger className="">Data Extraction</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.PAGE_TO_HTML} />
            <TaskMenuButton taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="interactions">
          <AccordionTrigger className="">User Interactions</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.FILL_INPUT} />
            <TaskMenuButton taskType={TaskType.CLICK_ELEMENT} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="timing">
          <AccordionTrigger className="">Timing controls</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.WAIT_FOR_ELEMENT} />
            {/* TODO: Add Delay task */}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  )
}

export default TaskMenu
