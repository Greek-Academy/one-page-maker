import { Fragment, ReactNode } from "react";

export const Menu = ({
  open,
  children,
  className = ""
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
}) => {
  if (!open) {
    return <Fragment />;
  }

  return (
    <menu className={`absolute z-10 rounded-md bg-slate-200 ${className}`}>
      {children}
    </menu>
  );
};

export const MenuItem = ({ children }: { children: ReactNode }) => {
  return (
    <li className={"rounded-md px-6 py-4 hover:bg-slate-300"}>{children}</li>
  );
};
