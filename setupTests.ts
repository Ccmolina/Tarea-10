import "@testing-library/jest-dom/vitest";
import React from "react";


vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn() })
  };
});

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) =>
    React.createElement("img", { ...props, alt: props?.alt ?? "image" })
}));
