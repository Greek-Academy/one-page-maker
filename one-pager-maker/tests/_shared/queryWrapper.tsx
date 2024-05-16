import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "../../src/queryClient";

export const queryWrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)
