import { setUpStore } from "@/store/store";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadState = {},
    store = setUpStore(preloadState),
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}> {children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
