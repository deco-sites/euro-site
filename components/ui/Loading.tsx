import Spinner from "$store/components/ui/Spinner.tsx";

type LoadingProps = {
  className: string;
}

export default function Loading({ className }: LoadingProps) {
  return (
    <div class={`w-full flex items-center justify-center ${className}`}>
      <Spinner />
    </div>
  );
}
