import {  cn  } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn("w-full max-w-3xl mx-auto px-4", className)} {...props}>
      {children}
    </div>
  );
}
