import { Browser, Page } from "puppeteer"
import { WorkflowTask } from "./workflow"
import { LogCollector } from "./log"

export type Environment = {
  browser?: Browser // Only one browser per execution
  page?: Page
  phases: Record<
    string, // nodeId
    { inputs: Record<string, string>; outputs: Record<string, string> }
  >
  // phases: {
  //   // key: nodeId
  //   [key: string]: {
  //     inputs: Record<string, string>
  //     outputs: Record<string, string>
  //   }
  // }
}

// This takes the input names and uses it as the type for the getInput function
export type ExecutionEnv<T extends WorkflowTask> = {
  getInput: (name: T["inputs"][number]["name"]) => string

  setOutput: (name: T["outputs"][number]["name"], value: string) => void

  getBrowser: () => Browser | undefined
  setBrowser: (browser: Browser) => void

  getPage: () => Page | undefined
  setPage: (page: Page) => void

  log: LogCollector
}
