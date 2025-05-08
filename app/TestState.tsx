"use client";
import { useAppState } from "./context/AppStateContext";

export default function TestState() {
  const { state } = useAppState();

  return (
    <div>
      <h2>Test App State</h2>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}